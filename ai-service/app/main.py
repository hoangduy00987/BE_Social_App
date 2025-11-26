from fastapi import FastAPI
from .routes.claim_router import router as claim_router


app = FastAPI(title="LLM + Knowledge Graph Fact Checking API")

app.include_router(claim_router)

@app.get("/")
def root():
    return {"message": "LLM-KG Fact Checking API is running."}
