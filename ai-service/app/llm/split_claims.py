from .llm_client import client
import json
import re

def split_claims(claim: str):
   prompt = f"""
   `   Phân tích câu sau và xác định xem nó có chứa nhiều mệnh đề (claims) độc lập hay không.

      QUY TẮC:
      1. Nếu câu CHỈ mô tả MỘT sự kiện duy nhất thì KHÔNG tách. Trả về danh sách với đúng 1 phần tử.

      2. Chỉ tách khi câu chứa hai sự kiện khác nhau có thể kiểm chứng RIÊNG BIỆT.

      3. Không tách câu có nhiều chi tiết nhưng vẫn xoay quanh một sự kiện duy nhất.

      OUTPUT:
      - Trả về JSON LIST duy nhất, ví dụ:
      ["claim 1"] hoặc ["claim 1", "claim 2"]
      - Không giải thích thêm.

      Câu cần xử lý:
      "{claim}"
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
