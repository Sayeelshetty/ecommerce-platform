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