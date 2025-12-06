from fastapi import APIRouter
from ..models.claim_models import ClaimRequest
from app.services.fact_checker import verify_claim

router = APIRouter()

@router.post("/fact-check")
def fact_check(request: ClaimRequest):
    return verify_claim(request.claim)
