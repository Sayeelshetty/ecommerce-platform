from typing import Optional


class UserModel:
    def __init__(
        self,
        name: str,
        email: str,
        password_hash: str,
        role: str = "customer",
    ):
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.role = role

    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "password_hash": self.password_hash,
            "role": self.role,
        }