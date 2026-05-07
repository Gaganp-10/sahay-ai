import os
import json
from dotenv import load_dotenv
from langchain_mistralai.chat_models import ChatMistralAI

load_dotenv()

class CommandParser:
    def __init__(self):
        self.llm = ChatMistralAI(
            model="mistral-small",
            api_key=os.getenv("MISTRAL_API_KEY")
        )

    def parse(self, query):
        prompt = f"""
You are an AI command parser for an elderly healthcare assistant.

Your task is to extract structured data from user input.

Return ONLY valid JSON. No explanation.

Fields:
- intent: one of [add_medicine, mark_taken, check_taken, get_today_logs, get_pending, none]
- medicine: string or null
- time: string or null

Rules:
- "I took paracetamol" → mark_taken
- "Did I take aspirin?" → check_taken
- "Add dolo at 9am" → add_medicine
- "What did I take today?" → get_today_logs
- "What medicines are pending?" → get_pending
- If unclear → intent = none

Examples:

Input: "I took paracetamol"
Output: {{"intent": "mark_taken", "medicine": "paracetamol", "time": null}}

Input: "Did I take aspirin?"
Output: {{"intent": "check_taken", "medicine": "aspirin", "time": null}}

Input: "Add dolo at 9am"
Output: {{"intent": "add_medicine", "medicine": "dolo", "time": "9am"}}

Input: "What did I take today?"
Output: {{"intent": "get_today_logs", "medicine": null, "time": null}}

Input: "What medicines are pending?"
Output: {{"intent": "get_pending", "medicine": null, "time": null}}

Input: "hello"
Output: {{"intent": "none", "medicine": null, "time": null}}

User input: "{query}"
"""

        response = self.llm.invoke(prompt).content.strip()

        # 🛡️ Clean response (remove markdown/code blocks)
        if "```" in response:
            response = response.split("```")[-1].strip()

        try:
            parsed = json.loads(response)

            return {
                "intent": parsed.get("intent", "none"),
                "medicine": parsed.get("medicine"),
                "time": parsed.get("time")
            }

        except Exception:
            return {
                "intent": "none",
                "medicine": None,
                "time": None
            }