from typing import Literal

from pydantic import BaseModel


OrderStatus = Literal["pending", "confirmed", "shipped", "delivered", "cancelled"]


class CheckoutInfo(BaseModel):
    name: str
    phone: str
    address: str
    city: str
    postal_code: str
    payment_method: Literal["cod", "mock_card"] = "cod"
    payment_status: Literal["pending", "paid", "failed"] = "pending"


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
    created_at: str | None = None
    shipping_info: CheckoutInfo | None = None
