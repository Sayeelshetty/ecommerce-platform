from datetime import datetime, timezone


class OrderModel:
    def __init__(
        self,
        user_id: str,
        items: list[dict],
        total_amount: float,
        status: str = "pending"
    ):
        self.user_id = user_id
        self.items = items
        self.total_amount = total_amount
        self.status = status
        self.created_at = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "items": self.items,
            "total_amount": self.total_amount,
            "status": self.status,
            "created_at": self.created_at,
        }
