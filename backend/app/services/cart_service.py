from bson import ObjectId

from app.database.mongodb import db
from app.schemas.cart import CartItemCreate


def serialize_cart(cart):
    if cart is None:
        return None

    return {
        "id": str(cart["_id"]),
        "user_id": str(cart["user_id"]),
        "items": [
            {
                "product_id": str(item["product_id"]),
                "quantity": item["quantity"],
            }
            for item in cart.get("items", [])
        ],
    }


def add_to_cart(user_id: str, item: CartItemCreate):
    try:
        product = db.products.find_one(
            {"_id": ObjectId(item.product_id)}
        )
    except Exception:
        return None

    if product is None:
        return None

    if item.quantity > product["stock"]:
        return None

    cart = db.carts.find_one(
        {"user_id": user_id}
    )

    if cart is None:
        cart_data = {
            "user_id": user_id,
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                }
            ],
        }

        result = db.carts.insert_one(cart_data)

        cart_data["_id"] = result.inserted_id

        return serialize_cart(cart_data)

    existing_item = None

    for cart_item in cart.get("items", []):
        if str(cart_item["product_id"]) == item.product_id:
            existing_item = cart_item
            break

    if existing_item:
        new_quantity = existing_item["quantity"] + item.quantity

        if new_quantity > product["stock"]:
            return None

        db.carts.update_one(
            {
                "_id": cart["_id"],
                "items.product_id": existing_item["product_id"],
            },
            {
                "$set": {
                    "items.$.quantity": new_quantity
                }
            },
        )

    else:
        db.carts.update_one(
            {"_id": cart["_id"]},
            {
                "$push": {
                    "items": {
                        "product_id": item.product_id,
                        "quantity": item.quantity,
                    }
                }
            },
        )

    updated_cart = db.carts.find_one(
        {"_id": cart["_id"]}
    )

    return serialize_cart(updated_cart)


def get_cart(user_id: str):
    cart = db.carts.find_one(
        {"user_id": user_id}
    )

    if cart is None:
        return {
            "id": None,
            "user_id": user_id,
            "items": []
        }

    return serialize_cart(cart)


def clear_cart(user_id: str):
    cart = db.carts.find_one({"user_id": user_id})
    if cart is None:
        return {"id": None, "user_id": user_id, "items": []}
    db.carts.update_one({"_id": cart["_id"]}, {"$set": {"items": []}})
    return serialize_cart(db.carts.find_one({"_id": cart["_id"]}))

def update_cart_item(
    user_id: str,
    product_id: str,
    quantity: int
):
    if quantity <= 0:
        return False

    cart = db.carts.find_one(
        {"user_id": user_id}
    )

    if cart is None:
        return False

    try:
        product = db.products.find_one(
            {"_id": ObjectId(product_id)}
        )
    except Exception:
        return False

    if product is None:
        return False

    if quantity > product["stock"]:
        return False

    result = db.carts.update_one(
        {
            "_id": cart["_id"],
            "items.product_id": product_id,
        },
        {
            "$set": {
                "items.$.quantity": quantity
            }
        },
    )

    if result.matched_count == 0:
        return False

    updated_cart = db.carts.find_one(
        {"_id": cart["_id"]}
    )

    return serialize_cart(updated_cart)


def remove_from_cart(
    user_id: str,
    product_id: str
):
    cart = db.carts.find_one(
        {"user_id": user_id}
    )

    if cart is None:
        return False

    result = db.carts.update_one(
        {"_id": cart["_id"]},
        {
            "$pull": {
                "items": {
                    "product_id": product_id
                }
            }
        },
    )

    if result.modified_count == 0:
        return False

    updated_cart = db.carts.find_one(
        {"_id": cart["_id"]}
    )

    return serialize_cart(updated_cart)