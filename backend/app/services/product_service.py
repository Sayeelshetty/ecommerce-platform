from bson import ObjectId
from pymongo import ASCENDING, DESCENDING

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

def serialize_product(product: dict) -> dict:
    """Convert MongoDB's ObjectId without leaking database-only fields."""
    product["id"] = str(product.pop("_id"))
    product.pop("created_at", None)
    return product


def get_products(
    search: str | None = None,
    category_id: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort: str = "newest",
    page: int = 1,
    limit: int = 10,
):
    query: dict = {}

    if search:
        # Escaping protects the intended literal name search from regex operators.
        import re
        query["name"] = {"$regex": re.escape(search), "$options": "i"}

    if category_id:
        try:
            ObjectId(category_id)
        except Exception as exc:
            raise ValueError("Invalid category ID") from exc
        query["category_id"] = category_id

    price_filter = {}
    if min_price is not None:
        price_filter["$gte"] = min_price
    if max_price is not None:
        price_filter["$lte"] = max_price
    if price_filter:
        query["price"] = price_filter

    sort_options = {
        "price_asc": ("price", ASCENDING),
        "price_desc": ("price", DESCENDING),
        "newest": ("created_at", DESCENDING),
    }
    sort_field, sort_direction = sort_options[sort]
    total = db.products.count_documents(query)
    products = list(
        db.products.find(query)
        .sort(sort_field, sort_direction)
        .skip((page - 1) * limit)
        .limit(limit)
    )

    return {
        "items": [serialize_product(product) for product in products],
        "page": page,
        "limit": limit,
        "total": total,
        "pages": (total + limit - 1) // limit,
    }


def update_product(product_id: str, product: ProductUpdate):
    update_data = product.model_dump(exclude_unset=True)

    if not update_data:
        return None

    # Validate category if category_id is being updated
    if "category_id" in update_data:
        try:
            category = db.categories.find_one(
                {"_id": ObjectId(update_data["category_id"])}
            )
        except Exception:
            return None

        if category is None:
            return None

    # Validate product ID
    try:
        object_id = ObjectId(product_id)
    except Exception:
        return None

    # Check that product exists
    existing_product = db.products.find_one({"_id": object_id})

    if existing_product is None:
        return None

    # Update product
    try:
        db.products.update_one(
            {"_id": object_id},
            {"$set": update_data}
        )
    except Exception:
        return None

    # Get updated product
    updated_product = db.products.find_one({"_id": object_id})

    if updated_product is None:
        return None

    return serialize_product(updated_product)


def delete_product(product_id: str):
    try:
        result = db.products.delete_one(
            {"_id": ObjectId(product_id)}
        )
    except Exception:
        return False

    return result.deleted_count > 0
