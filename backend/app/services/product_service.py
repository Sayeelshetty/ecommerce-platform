from app.models.product import ProductModel
from app.schemas.product import ProductCreate
from app.database.mongodb import db


def create_product(product: ProductCreate):
    product_model = ProductModel(
        name=product.name,
        description=product.description,
        price=product.price,
        category=product.category,
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
        "category": product_data["category"],
        "stock": product_data["stock"],
        "image_url": product_data["image_url"],
    }




def get_products():
    products = list(db.products.find())

    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]

    return products
