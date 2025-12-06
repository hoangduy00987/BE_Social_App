from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.claim_router import router

app = FastAPI(title="KG Fact Check API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def home():
    return {"message": "KG Fact Checking API is running!"}
