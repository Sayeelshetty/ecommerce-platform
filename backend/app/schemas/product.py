from pydantic import BaseModel,Field
from typing import Optional

class ProductCreate(BaseModel):
    name: str = Field(...,min_length=2,max_length=100)
    description: str = Field(...,min_length=5)
    price: float = Field(...,gt=0)
    category: str
    stock:int = Field(...,ge=0)
    image_url: Optional[str] = None
