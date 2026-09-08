from bson import ObjectId

from app.database.mongodb import db
from app.models.order import OrderModel


class OrderServiceError(Exception):
    def __init__(self, detail: str, status_code: int) -> None:
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


ALLOWED_TRANSITIONS = {
    "pending": {"confirmed", "cancelled"}, "confirmed": {"shipped", "cancelled"},
    "shipped": {"delivered"}, "delivered": set(), "cancelled": set(),
}


def _object_id(value: str, label: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise OrderServiceError(f"Invalid {label} ID", 422)
    return ObjectId(value)


def serialize_order(order: dict) -> dict:
    return {"id": str(order["_id"]), "user_id": order["user_id"], "items": order["items"],
            "total_amount": order["total_amount"], "status": order["status"]}


def create_order(user_id: str) -> dict:
    """Checkout with conditional decrements, preventing concurrent overselling.

    Standalone local MongoDB does not support transactions, so failures compensate
    already-applied decrements before an order is created.
    """
    cart = db.carts.find_one({"user_id": user_id})
    if cart is None or not cart.get("items"):
        raise OrderServiceError("Cart is empty", 400)

    order_items, total_amount = [], 0.0
    for item in cart["items"]:
        product = db.products.find_one({"_id": _object_id(item["product_id"], "product")})
        if product is None:
            raise OrderServiceError("Product not found", 404)
        if item["quantity"] > product["stock"]:
            raise OrderServiceError("Insufficient stock", 409)
        order_items.append({"product_id": item["product_id"], "quantity": item["quantity"], "price": product["price"]})
        total_amount += product["price"] * item["quantity"]

    decremented = []
    for item in order_items:
        result = db.products.update_one(
            {"_id": ObjectId(item["product_id"]), "stock": {"$gte": item["quantity"]}},
            {"$inc": {"stock": -item["quantity"]}},
        )
        if result.modified_count != 1:
            for previous in decremented:
                db.products.update_one({"_id": ObjectId(previous["product_id"])}, {"$inc": {"stock": previous["quantity"]}})
            raise OrderServiceError("Insufficient stock", 409)
        decremented.append(item)

    try:
        result = db.orders.insert_one(OrderModel(user_id=user_id, items=order_items, total_amount=total_amount).to_dict())
    except Exception as exc:
        for item in decremented:
            db.products.update_one({"_id": ObjectId(item["product_id"])}, {"$inc": {"stock": item["quantity"]}})
        raise OrderServiceError("Unable to create order", 400) from exc

    db.carts.update_one({"_id": cart["_id"]}, {"$set": {"items": []}})
    return serialize_order(db.orders.find_one({"_id": result.inserted_id}))


def get_user_orders(user_id: str) -> list[dict]:
    return [serialize_order(order) for order in db.orders.find({"user_id": user_id}).sort("created_at", -1)]


def get_order_by_id(user_id: str, order_id: str) -> dict:
    order = db.orders.find_one({"_id": _object_id(order_id, "order"), "user_id": user_id})
    if order is None:
        raise OrderServiceError("Order not found", 404)
    return serialize_order(order)


def _restore_stock(order: dict) -> None:
    for item in order["items"]:
        db.products.update_one({"_id": ObjectId(item["product_id"])}, {"$inc": {"stock": item["quantity"]}})


def cancel_order(user_id: str, order_id: str) -> dict:
    object_id = _object_id(order_id, "order")
    order = db.orders.find_one({"_id": object_id, "user_id": user_id})
    if order is None:
        raise OrderServiceError("Order not found", 404)
    if order["status"] != "pending":
        raise OrderServiceError("Order cannot be cancelled", 409)
    if db.orders.update_one({"_id": object_id, "status": "pending"}, {"$set": {"status": "cancelled"}}).modified_count != 1:
        raise OrderServiceError("Order cannot be cancelled", 409)
    _restore_stock(order)
    return serialize_order(db.orders.find_one({"_id": object_id}))


def get_all_orders() -> list[dict]:
    return [serialize_order(order) for order in db.orders.find().sort("created_at", -1)]


def get_order_for_admin(order_id: str) -> dict:
    order = db.orders.find_one({"_id": _object_id(order_id, "order")})
    if order is None:
        raise OrderServiceError("Order not found", 404)
    return serialize_order(order)


def update_order_status(order_id: str, new_status: str) -> dict:
    object_id = _object_id(order_id, "order")
    order = db.orders.find_one({"_id": object_id})
    if order is None:
        raise OrderServiceError("Order not found", 404)
    current_status = order.get("status")
    if new_status not in ALLOWED_TRANSITIONS.get(current_status, set()):
        raise OrderServiceError("Invalid order status transition", 409)
    if db.orders.update_one({"_id": object_id, "status": current_status}, {"$set": {"status": new_status}}).modified_count != 1:
        raise OrderServiceError("Invalid order status transition", 409)
    if new_status == "cancelled":
        _restore_stock(order)
    return serialize_order(db.orders.find_one({"_id": object_id}))
