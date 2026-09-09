from typing import Optional

from pydantic import BaseModel, Field, model_validator


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=5)
    price: float = Field(..., gt=0)
    offer_price: Optional[float] = Field(None, gt=0)
    rating: float = Field(0, ge=0, le=5)
    review_count: int = Field(0, ge=0)
    category_id: str
    stock: int = Field(..., ge=0)
    image_url: Optional[str] = None

    @model_validator(mode="after")
    def validate_offer_price(self):
        if self.offer_price is not None and self.offer_price > self.price:
            raise ValueError("offer_price cannot exceed price")
        return self


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, min_length=5)
    price: Optional[float] = Field(None, gt=0)
    offer_price: Optional[float] = Field(None, gt=0)
    rating: Optional[float] = Field(None, ge=0, le=5)
    review_count: Optional[int] = Field(None, ge=0)
    category_id: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
