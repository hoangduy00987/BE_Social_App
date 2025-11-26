from google.genai import Client, types
from app.core.config import GEMINI_API_KEY

client = Client(api_key=GEMINI_API_KEY)

def llm_reasoning_with_kg(claim: str, evidence_text: str):
    prompt = f"""
    You are a fact-checking assistant using structured knowledge.

    CLAIM: "{claim}"

    KNOWLEDGE GRAPH FACTS:
    {evidence_text}

    TASK:
    - Decide if the claim is TRUE, FALSE, or NOT ENOUGH INFO.
    - Give reasoning in Vietnamese explaining which facts support or contradict it.
    - If possible, quote relevant entities or relations.

    Output JSON:
    {{
      "verdict": "TRUE | FALSE | NEI",
      "explanation": "..."
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.UserContent(
                parts=[types.Part.from_text(text=prompt)]
            )
        ]
    )

    return response.text
