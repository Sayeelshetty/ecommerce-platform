from fastapi import FastAPI

from app.database.mongodb import db
from app.routes.product import router as product_router 
from app.routes.auth import router as auth_router


app = FastAPI()


@app.get("/")
def root():
    return {"message": "E-Commerce API is running"}


@app.get("/db-test")
def database_test():
    try:
        db.command("ping")
        return {"message": "MongoDB connection successful"}
    except Exception as e:
        return {"message": "MongoDB connection failed", "error": str(e)}
    

app.include_router(product_router)
app.include_router(auth_router)