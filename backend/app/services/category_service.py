from app.database.mongodb import db
from app.models.category import CategoryModel
from app.schemas.category import CategoryCreate


def create_category(category: CategoryCreate):
    existing_category = db.categories.find_one(
        {"name": category.name}
    )

    if existing_category:
        return None

    category_model = CategoryModel(
        name=category.name,
        description=category.description,
    )

    category_data = category_model.to_dict()

    result = db.categories.insert_one(category_data)

    return {
        "id": str(result.inserted_id),
        "name": category_data["name"],
        "description": category_data["description"],
    }


def get_categories():
    categories = list(db.categories.find())

    for category in categories:
        category["id"] = str(category["_id"])
        del category["_id"]

    return categories