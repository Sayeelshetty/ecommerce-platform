from bson import ObjectId

from app.database.mongodb import db
from app.models.product import ProductModel
from app.schemas.product import ProductCreate, ProductUpdate

def create_product(product: ProductCreate):
    try:
        category = db.categories.find_one(
            {"_id": ObjectId(product.category_id)}
        )
    except Exception:
        return None

    if category is None:
        return None

    product_model = ProductModel(
        name=product.name,
        description=product.description,
        price=product.price,
        category_id=product.category_id,
        stock=product.stock,
        image_url=product.image_url,
    )

    product_data = product_model.to_dict()

    result = db.products.insert_one(product_data)

    return {
        "id": str(result.inserted_id),
        "name": product_data["name"],
        "description": product_data["description"],
        "price": product_data["price"],
        "category_id": product_data["category_id"],
        "stock": product_data["stock"],
        "image_url": product_data["image_url"],
    }

def get_products():
    products = list(db.products.find())

    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]

    return products


def update_product(product_id: str, product: ProductUpdate):
    update_data = product.model_dump(exclude_unset=True)

    if not update_data:
        return None

    if "category_id" in update_data:
        try:
            category = db.categories.find_one(
                {"_id": ObjectId(update_data["category_id"])}
            )
        except Exception:
            return None

        if category is None:
            return None

    try:
        result = db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )
    except Exception:
        return None

    if result.matched_count == 0:
        return None

    updated_product = db.products.find_one(
        {"_id": ObjectId(product_id)}
    )

    updated_product["id"] = str(updated_product["_id"])
    del updated_product["_id"]

    return updated_product


def delete_product(product_id: str):
    try:
        result = db.products.delete_one(
            {"_id": ObjectId(product_id)}
        )
    except Exception:
        return False

    return result.deleted_count > 0