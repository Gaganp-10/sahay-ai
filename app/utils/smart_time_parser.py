import os
import json
from dotenv import load_dotenv
from langchain_mistralai.chat_models import ChatMistralAI

load_dotenv()

class SmartTimeParser:
    def __init__(self):
        self.llm = ChatMistralAI(
            model="mistral-small",
            api_key=os.getenv("MISTRAL_API_KEY")
        )

    def parse(self, query):
        prompt = f"""
You are a time extraction assistant.

Convert the user's time expression into 24-hour format (HH:MM).

Rules:
- Morning ≈ 08:00
- Afternoon ≈ 13:00
- Evening ≈ 18:00
- Night ≈ 21:00
- Before sleep ≈ 22:00
- Around X → nearest hour (e.g., 10 → 10:00)
- "8 in the morning" → 08:00

Return ONLY JSON:

{{ "time": "HH:MM" }}

If no time found:
{{ "time": null }}

User input: "{query}"
"""

        response = self.llm.invoke(prompt).content.strip()

        # 🛡️ Clean markdown/code blocks
        if "```" in response:
            response = response.split("```")[-1].strip()

        try:
            data = json.loads(response)
            time = data.get("time")

            # 🧠 NORMALIZE FORMAT (CRITICAL FIX)
            if time:
                time = time.strip()

                # Case 1: "10" → "10:00"
                if ":" not in time:
                    hour = int(time)
                    time = f"{hour:02d}:00"

                # Case 2: "8:0" → "08:00"
                else:
                    parts = time.split(":")
                    if len(parts) == 2:
                        hour = int(parts[0])
                        minute = int(parts[1])
                        time = f"{hour:02d}:{minute:02d}"

            return time

        except Exception:
            return None