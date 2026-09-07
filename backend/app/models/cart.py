from typing import List


class CartItemModel:
    def __init__(
        self,
        product_id: str,
        quantity: int,
    ):
        self.product_id = product_id
        self.quantity = quantity

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "quantity": self.quantity,
        }


class CartModel:
    def __init__(
        self,
        user_id: str,
        items: List[dict] | None = None,
    ):
        self.user_id = user_id
        self.items = items or []

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "items": self.items,
        }