from app.database.mongodb import db
from app.models.user import UserModel
from app.schemas.user import UserCreate
from app.utils.security import hash_password


def register_user(user: UserCreate):
    existing_user = db.users.find_one({"email": user.email})

    if existing_user:
        return None

    password_hash = hash_password(user.password)

    user_model = UserModel(
        name=user.name,
        email=user.email,
        password_hash=password_hash,
    )

    user_data = user_model.to_dict()

    result = db.users.insert_one(user_data)

    return {
        "id": str(result.inserted_id),
        "name": user_data["name"],
        "email": user_data["email"],
        "role": user_data["role"],
    }