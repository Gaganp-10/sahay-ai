import json
import os

from dotenv import load_dotenv
from langchain_mistralai.chat_models import ChatMistralAI

load_dotenv()


class PrescriptionParser:
    def __init__(self):
        self.llm = ChatMistralAI(
            model="mistral-small",
            api_key=os.getenv("MISTRAL_API_KEY")
        )

    def parse(self, text):
        prompt = f"""
You are an AI prescription parser.

Extract medicine schedule information.

Return ONLY valid JSON.

Format:
{{
    "medicine": "string",
    "time": "string"
}}

Rules:
- morning → 08:00
- afternoon → 13:00
- evening → 18:00
- night → 21:00
- after dinner → 21:00
- before sleep → 22:00

Prescription text:
{text}
"""

        try:
            response = self.llm.invoke(prompt).content.strip()

            if "```" in response:
                response = response.replace("```json", "")
                response = response.replace("```", "")

            return json.loads(response)

        except:
            return None