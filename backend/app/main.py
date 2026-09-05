from fastapi import FastAPI

from app.database.mongodb import db

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