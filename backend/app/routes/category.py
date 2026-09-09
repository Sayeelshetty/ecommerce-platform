from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.category import CategoryCreate
from app.services.category_service import (
    create_category,
    get_categories,
)
from app.utils.admin import get_current_admin


router = APIRouter(
    prefix="/category",
    tags=["Categories"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_category_api(category: CategoryCreate, current_admin=Depends(get_current_admin)):
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