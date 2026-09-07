from app.database.mongodb import db
from app.models.user import UserModel
from app.schemas.user import UserCreate,UserLogin
from app.utils.security import hash_password,verify_password, create_access_token
from bson import ObjectId


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


def login_user(user: UserLogin):
    existing_user = db.users.find_one({"email": user.email})

    if not existing_user:
        return None

    password_valid = verify_password(
        user.password,
        existing_user["password_hash"]
    )

    if not password_valid:
        return None

    access_token = create_access_token(
        {
            "sub": str(existing_user["_id"]),
            "email": existing_user["email"],
            "role": existing_user["role"],
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

def get_current_user_by_id(user_id: str):
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})

        if user is None:
            return None

        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        }

    except Exception:
        return None