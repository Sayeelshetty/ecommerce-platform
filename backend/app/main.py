from contextlib import asynccontextmanager

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.mongodb import create_indexes
from app.routes.product import router as product_router
from app.routes.auth import router as auth_router
from app.routes.category import router as category_router
from app.routes.cart import router as cart_router
from app.routes.order import router as order_router
from app.routes.wishlist import router as wishlist_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_indexes()
    yield


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(product_router)
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(wishlist_router)


@app.get("/")
def root():
    return {
        "message": "Ecommerce API is running"
    }


@app.get("/db-test")
def database_health():
    from app.database.mongodb import client

    client.admin.command("ping")
    return {"status": "ok", "database": "connected"}