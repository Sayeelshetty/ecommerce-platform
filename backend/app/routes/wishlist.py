from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.database.mongodb import db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

class WishlistItem(BaseModel):
    product_id: str

def serialize(doc):
    return {"id": str(doc["_id"]), "user_id": doc["user_id"], "product_ids": doc.get("product_ids", [])}

@router.get("/")
def get_wishlist(current_user=Depends(get_current_user)):
    doc = db.wishlists.find_one({"user_id": current_user["sub"]})
    return serialize(doc) if doc else {"id": None, "user_id": current_user["sub"], "product_ids": []}

@router.post("/", status_code=status.HTTP_201_CREATED)
def add_wishlist_item(item: WishlistItem, current_user=Depends(get_current_user)):
    if not ObjectId.is_valid(item.product_id) or not db.products.find_one({"_id": ObjectId(item.product_id)}):
        raise HTTPException(status_code=404, detail="Product not found")
    db.wishlists.update_one({"user_id": current_user["sub"]}, {"$addToSet": {"product_ids": item.product_id}}, upsert=True)
    return get_wishlist(current_user)

@router.delete("/{product_id}")
def remove_wishlist_item(product_id: str, current_user=Depends(get_current_user)):
    db.wishlists.update_one({"user_id": current_user["sub"]}, {"$pull": {"product_ids": product_id}})
    return get_wishlist(current_user)