from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.schemas.cart import CartItemCreate, CartQuantityUpdate
from app.services.cart_service import (
    add_to_cart,
    get_cart,
    update_cart_item,
    remove_from_cart,
)
from app.utils.auth import get_current_user


class CartQuantityUpdate(BaseModel):
    quantity: int = Field(..., gt=0)


router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def add_product_to_cart(
    item: CartItemCreate,
    current_user=Depends(get_current_user),
):
    user_id = current_user["sub"]

    cart = add_to_cart(user_id, item)

    if cart is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product not found or insufficient stock",
        )

    return cart


@router.get("/")
def get_user_cart(
    current_user=Depends(get_current_user),
):
    user_id = current_user["sub"]

    return get_cart(user_id)


@router.put("/{product_id}")
def update_cart_product(
    product_id: str,
    data: CartQuantityUpdate,
    current_user=Depends(get_current_user),
):
    user_id = current_user["sub"]

    cart = update_cart_item(
        user_id,
        product_id,
        data.quantity,
    )

    if cart is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to update cart item",
        )

    return cart


@router.delete("/{product_id}")
def delete_cart_product(
    product_id: str,
    current_user=Depends(get_current_user),
):
    user_id = current_user["sub"]

    cart = remove_from_cart(
        user_id,
        product_id,
    )

    if cart is False:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found in cart",
        )

    return cart