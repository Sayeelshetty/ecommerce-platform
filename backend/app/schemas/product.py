from pydantic import BaseModel,Field
from typing import Optional

class ProductCreate(BaseModel):
    name: str = Field(...,min_length=2,max_length=100)
    description: str = Field(...,min_length=5)
    price: float = Field(...,gt=0)
    category: str
    stock:int = Field(...,ge=0)
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, min_length=5)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None