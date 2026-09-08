from typing import Literal

from pydantic import BaseModel


OrderStatus = Literal["pending", "confirmed", "shipped", "delivered", "cancelled"]


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float


class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: list[OrderItem]
    total_amount: float
    status: OrderStatus
