from fastapi import APIRouter, HTTPException, status

from app.schemas.category import CategoryCreate
from app.services.category_service import (
    create_category,
    get_categories,
)


router = APIRouter(
    prefix="/category",
    tags=["Categories"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_category_api(category: CategoryCreate):
    created_category = create_category(category)

    if created_category is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Category already exists"
        )

    return created_category


@router.get("/")
def get_categories_api():
    return get_categories()