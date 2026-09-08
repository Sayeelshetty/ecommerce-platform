from bson import ObjectId
from app.database.mongodb import db
from app.models.order import OrderModel


def create_order(user_id: str):
    # Get user's cart
    cart = db.carts.find_one({"user_id": user_id})

    if cart is None or not cart.get("items"):
        return False

    order_items = []
    total_amount = 0

    # Check every cart item
    for item in cart["items"]:
        product_id = item["product_id"]
        quantity = item["quantity"]

        try:
            product = db.products.find_one({
                "_id": ObjectId(product_id)
            })
        except Exception:
            return False

        if product is None:
            return False

        # Check stock
        if quantity > product["stock"]:
            return False

        price = product["price"]

        order_items.append({
            "product_id": product_id,
            "quantity": quantity,
            "price": price
        })

        total_amount += price * quantity

    # Create order
    order = OrderModel(
        user_id=user_id,
        items=order_items,
        total_amount=total_amount
    )

    result = db.orders.insert_one(order.to_dict())

    # Reduce stock
    for item in cart["items"]:
        db.products.update_one(
            {"_id": ObjectId(item["product_id"])},
            {"$inc": {"stock": -item["quantity"]}}
        )

    # Clear cart
    db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": []}}
    )

    created_order = db.orders.find_one({
        "_id": result.inserted_id
    })

    return {
        "id": str(created_order["_id"]),
        "user_id": created_order["user_id"],
        "items": created_order["items"],
        "total_amount": created_order["total_amount"],
        "status": created_order["status"]
    }


def get_user_orders(user_id: str):
    orders = db.orders.find({"user_id": user_id})

    result = []

    for order in orders:
        result.append({
            "id": str(order["_id"]),
            "user_id": order["user_id"],
            "items": order["items"],
            "total_amount": order["total_amount"],
            "status": order["status"]
        })

    return result

def get_order_by_id(user_id: str, order_id: str):
    try:
        order = db.orders.find_one({
            "_id": ObjectId(order_id),
            "user_id": user_id
        })
    except Exception:
        return False

    if order is None:
        return False

    return {
        "id": str(order["_id"]),
        "user_id": order["user_id"],
        "items": order["items"],
        "total_amount": order["total_amount"],
        "status": order["status"]
    }

def cancel_order(user_id: str, order_id: str):
    try:
        order = db.orders.find_one({
            "_id": ObjectId(order_id),
            "user_id": user_id
        })
    except Exception:
        return False

    if order is None:
        return False

    # Only pending orders can be cancelled
    if order["status"] != "pending":
        return False

    # Restore product stock
    for item in order["items"]:
        try:
            db.products.update_one(
                {"_id": ObjectId(item["product_id"])},
                {"$inc": {"stock": item["quantity"]}}
            )
        except Exception:
            return False

    # Change order status
    db.orders.update_one(
        {"_id": order["_id"]},
        {"$set": {"status": "cancelled"}}
    )

    updated_order = db.orders.find_one({
        "_id": order["_id"]
    })

    return {
        "id": str(updated_order["_id"]),
        "user_id": updated_order["user_id"],
        "items": updated_order["items"],
        "total_amount": updated_order["total_amount"],
        "status": updated_order["status"]
    }

def get_all_orders():
    orders = db.orders.find()

    result = []

    for order in orders:
        result.append({
            "id": str(order["_id"]),
            "user_id": order["user_id"],
            "items": order["items"],
            "total_amount": order["total_amount"],
            "status": order["status"]
        })

    return result