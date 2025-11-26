from fastapi import APIRouter
from app.models.claim_models import ClaimRequest
from app.services.ner_service import extract_entities
from app.services.kg_service import query_kg_for_entities
from app.services.llm_service import llm_reasoning_with_kg

router = APIRouter(prefix="/claim", tags=["Claim Verification"])

@router.post("/verify")
def verify_claim(req: ClaimRequest):
    claim = req.claim

    # Step 1: extract entities
    entities = extract_entities(claim)

    # Step 2: get triples from KG
    triples = query_kg_for_entities(entities)
    print(triples)
    if not triples:
        return {
            "verdict": "NEI",
            "explanation": "Không tìm thấy bằng chứng trong KG."
        }

    # Build evidence text
    evidence_text = "\n".join([
        f"- {t['source']} ({t['relation']}) {t['target']} : {t.get('sentence','')}"
        for t in triples
    ])

    # Step 3: LLM reasoning
    result = llm_reasoning_with_kg(claim, evidence_text)

    return {
        "entities": entities,
        "evidence": evidence_text,
        "llm_result": result
    }
