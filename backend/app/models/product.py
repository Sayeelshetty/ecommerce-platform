from typing import Optional


class ProductModel:
    def __init__(
        self,
        name: str,
        description: str,
        price: float,
        category_id: str,
        stock: int,
        image_url: Optional[str] = None,
    ):
        self.name = name
        self.description = description
        self.price = price
        self.category_id = category_id
        self.stock = stock
        self.image_url = image_url

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category_id": self.category_id,
            "stock": self.stock,
            "image_url": self.image_url,
        }