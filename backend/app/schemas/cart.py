from pydantic import BaseModel, Field


class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)


class CartQuantityUpdate(BaseModel):
    quantity: int = Field(..., gt=0)