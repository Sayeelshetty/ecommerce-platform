from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.order import OrderStatusUpdate
from app.services.order_service import (
    OrderServiceError, cancel_order, create_order, get_all_orders,
    get_order_by_id, get_order_for_admin, get_user_orders, update_order_status,
)
from app.utils.admin import get_current_admin
from app.utils.auth import get_current_user

router = APIRouter(prefix="/order", tags=["Order"])


def _raise_service_error(error: OrderServiceError) -> None:
    raise HTTPException(status_code=error.status_code, detail=error.detail)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user_order(current_user=Depends(get_current_user)):
    try:
        return create_order(current_user["sub"])
    except OrderServiceError as error:
        _raise_service_error(error)


# Admin routes must precede /{order_id} so FastAPI does not treat "admin" as an ID.
@router.get("/admin/all")
def get_all_orders_for_admin(current_admin=Depends(get_current_admin)):
    return get_all_orders()


@router.get("/admin/{order_id}")
def get_single_order_for_admin(order_id: str, current_admin=Depends(get_current_admin)):
    try:
        return get_order_for_admin(order_id)
    except OrderServiceError as error:
        _raise_service_error(error)


@router.patch("/{order_id}/status")
def update_order_status_for_admin(order_id: str, data: OrderStatusUpdate, current_admin=Depends(get_current_admin)):
    try:
        return update_order_status(order_id, data.status)
    except OrderServiceError as error:
        _raise_service_error(error)


@router.get("/")
def get_orders(current_user=Depends(get_current_user)):
    return get_user_orders(current_user["sub"])


@router.get("/{order_id}")
def get_single_order(order_id: str, current_user=Depends(get_current_user)):
    try:
        return get_order_by_id(current_user["sub"], order_id)
    except OrderServiceError as error:
        _raise_service_error(error)


@router.delete("/{order_id}")
def cancel_user_order(order_id: str, current_user=Depends(get_current_user)):
    try:
        return cancel_order(current_user["sub"], order_id)
    except OrderServiceError as error:
        _raise_service_error(error)
