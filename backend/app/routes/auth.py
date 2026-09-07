from fastapi import APIRouter, HTTPException, status,Depends
from app.schemas.user import UserCreate,UserLogin
from app.services.auth_service import register_user,login_user,get_current_user_by_id
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate):
    created_user = register_user(user)

    if created_user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    return created_user


@router.post("/login")
def login(user: UserLogin):
    result = login_user(user)

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return result

@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    user = get_current_user_by_id(current_user["sub"])

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user