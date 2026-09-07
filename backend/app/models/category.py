from typing import Optional


class CategoryModel:
    def __init__(
        self,
        name: str,
        description: Optional[str] = None,
    ):
        self.name = name
        self.description = description

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
        }