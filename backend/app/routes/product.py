from fastapi import APIRouter,status,HTTPException
from app.schemas.product import ProductCreate,ProductUpdate
from app.services.product_service import (
    create_product,
    get_products,
    update_product,
    delete_product,
)

router = APIRouter(
    prefix = '/product',
    tags = ["Products"]

)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product_api(product: ProductCreate):
    created_product = create_product(product)

    if created_product is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category_id"
        )

    return created_product

@router.get("/")
def get_products_api():
    return get_products()


@router.put("/{product_id}")
def update_product_api(product_id: str, product: ProductUpdate):
    updated_product = update_product(product_id, product)

    if updated_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product or category not found"
        )

    return updated_product



@router.delete("/{product_id}")
def delete_product_api(product_id: str):
    deleted = delete_product(product_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return {"message": "Product deleted successfully"}




