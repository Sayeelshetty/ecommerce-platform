from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.schemas.product import ProductCreate, ProductUpdate

from app.services.product_service import (
    get_products,
    update_product as update_product_service,
    delete_product as delete_product_service,
    create_product as create_product_service,
)

from app.utils.admin import get_current_admin


router = APIRouter(
    prefix="/product",
    tags=["Products"]
)


@router.post("/")
def create_product(
    product: ProductCreate,
    current_admin=Depends(get_current_admin)
):
    created_product = create_product_service(product)
    return created_product


@router.get("/")
def get_products_api(
    search: str | None = Query(None, min_length=1, max_length=100),
    category_id: str | None = None,
    min_price: float | None = Query(None, ge=0),
    max_price: float | None = Query(None, ge=0),
    sort: Literal["price_asc", "price_desc", "newest"] = "newest",
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="min_price cannot exceed max_price")
    try:
        return get_products(search, category_id, min_price, max_price, sort, page, limit)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc


@router.put("/{product_id}")
def update_product(
    product_id: str,
    product: ProductUpdate,
    current_admin=Depends(get_current_admin)
):
    updated_product = update_product_service(product_id, product)

    if updated_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product or category not found"
        )

    return updated_product


@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    current_admin=Depends(get_current_admin)
):
    deleted = delete_product_service(product_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return {"message": "Product deleted successfully"}
