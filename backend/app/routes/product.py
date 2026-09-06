from fastapi import APIRouter,status
from app.schemas.product import ProductCreate
from app.services.product_service import create_product,get_products


router = APIRouter(
    prefix = '/product',
    tags = ["Products"]

)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product_api(product: ProductCreate):
    return create_product(product)

@router.get("/")
def get_products_api():
    return get_products()


