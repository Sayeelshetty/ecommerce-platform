from fastapi import APIRouter, Depends, HTTPException, status
from app.services.order_service import (
    create_order,
    get_user_orders,
    get_order_by_id,
    cancel_order,
    get_all_orders
)
from app.utils.auth import get_current_user
from app.utils.admin import get_current_admin


router = APIRouter(prefix="/order", tags=["Order"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user_order(current_user=Depends(get_current_user)):
    user_id = current_user["sub"]

    result = create_order(user_id)

    if result is False:
        raise HTTPException(
            status_code=400,
            detail="Unable to create order"
        )

    return result

@router.get("/")
def get_orders(current_user=Depends(get_current_user)):
    user_id = current_user["sub"]

    return get_user_orders(user_id)

@router.get("/{order_id}")
def get_single_order(
    order_id: str,
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    result = get_order_by_id(user_id, order_id)

    if result is False:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return result


@router.get("/admin/all")
def get_all_orders_for_admin(
    current_admin=Depends(get_current_admin)
):
    return get_all_orders()


@router.delete("/{order_id}")
def cancel_user_order(
    order_id: str,
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    result = cancel_order(user_id, order_id)

    if result is False:
        raise HTTPException(
            status_code=400,
            detail="Unable to cancel order"
        )

    return result


