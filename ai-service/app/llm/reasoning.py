import json
import re
from .llm_client import client  # client = OpenAI(api_key=...)

def llm_reasoning(claim: str, evidence: str):
    prompt = f"""
    Bạn là trợ lý kiểm chứng thông tin dựa trên tri thức có cấu trúc từ Knowledge Graph.

    Nhiệm vụ của bạn:

    1. Ưu tiên xác định claim là TRUE hoặc FALSE trước.
    - Nếu Knowledge Graph chứa thông tin hỗ trợ claim → trả lời TRUE.
    - Nếu Knowledge Graph có thông tin mâu thuẫn, phủ định claim → trả lời FALSE.

    2. Chỉ trả lời NEI khi thật sự không có bất kỳ dữ kiện nào liên quan đến claim,
    hoặc các dữ kiện không đủ để kết luận rõ ràng.

    3. Giải thích bằng tiếng Việt, tự nhiên và thuyết phục,
    dựa vào hiểu biết từ các facts trong Knowledge Graph,
    nhưng không được trích nguyên văn entity hoặc quan hệ.
    Hãy chuyển chúng thành câu mô tả tự nhiên.

    Dữ liệu:

    CLAIM: "{claim}"

    FACTS TỪ KNOWLEDGE GRAPH:
    {evidence}

    Hãy trả về JSON với cấu trúc:
    {{
        "verdict": "TRUE | FALSE | NEI",
        "explanation": "Lời giải thích tự nhiên và thuyết phục dựa trên facts."
    }}
    """

    completion = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[
        {"role": "user", "content": prompt}
    ]
)

    resp_text = completion.choices[0].message.content

    cleaned = re.sub(r"```json|```", "", resp_text).strip()
    return json.loads(cleaned)

