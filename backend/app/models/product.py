from typing import Optional


class ProductModel:
    def __init__(
        self,
        name: str,
        description: str,
        price: float,
        category: str,
        stock: int,
        image_url: Optional[str] = None,
    ):
        self.name = name
        self.description = description
        self.price = price
        self.category = category
        self.stock = stock
        self.image_url = image_url

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "stock": self.stock,
            "image_url": self.image_url,
        }