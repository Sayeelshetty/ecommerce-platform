from fastapi import APIRouter, Depends, HTTPException, status

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
def get_products_api():
    return get_products()


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