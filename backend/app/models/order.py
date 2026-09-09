from datetime import datetime, timezone


class OrderModel:
    def __init__(
        self,
        user_id: str,
        items: list[dict],
        total_amount: float,
        shipping_info: dict | None = None,
        payment_method: str = "cod",
        payment_status: str = "pending",
        status: str = "pending"
    ):
        self.user_id = user_id
        self.items = items
        self.total_amount = total_amount
        self.shipping_info = shipping_info
        self.payment_method = payment_method
        self.payment_status = payment_status
        self.status = status
        self.created_at = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "items": self.items,
            "total_amount": self.total_amount,
            "shipping_info": self.shipping_info,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "status": self.status,
            "created_at": self.created_at,
        }
