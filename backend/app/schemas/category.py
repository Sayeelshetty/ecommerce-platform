from pydantic import BaseModel, Field
from typing import Optional


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None