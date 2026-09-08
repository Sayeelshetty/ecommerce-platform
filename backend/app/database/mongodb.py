import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ecommerce")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not configured")

client = MongoClient(MONGODB_URI)

db = client[DATABASE_NAME]


def create_indexes() -> None:
    """Create the query indexes used by the API. Calls are idempotent in MongoDB."""
    db.users.create_index("email", unique=True, name="users_email_unique")
    db.categories.create_index("name", unique=True, name="categories_name_unique")
    db.products.create_index("category_id", name="products_category_id")
    db.products.create_index("created_at", name="products_created_at")
    db.orders.create_index("user_id", name="orders_user_id")
    db.orders.create_index("status", name="orders_status")
    db.orders.create_index([("user_id", 1), ("created_at", -1)], name="orders_user_created_at")
