import os
from dotenv import load_dotenv
from langchain_mistralai.chat_models import ChatMistralAI
from app.utils.command_parser import CommandParser
from app.utils.time_parser import TimeParser
from app.utils.smart_time_parser import SmartTimeParser
from app.utils.emotion_detector import EmotionDetector

load_dotenv()

class SahayAssistant:
    def __init__(self):
        self.llm = ChatMistralAI(
            model="mistral-small",
            api_key=os.getenv("MISTRAL_API_KEY")
        )
        self.parser = CommandParser()
        self.time_parser = TimeParser()
        self.smart_time_parser = SmartTimeParser()
        self.emotion_detector = EmotionDetector()

    def respond(self, query, repeated=False, tracker=None, context=None, personalization=None):
        query_lower = query.lower()

        # 🧠 STEP 1 — INTENT PARSING
        parsed = self.parser.parse(query)

        intent = parsed.get("intent")
        medicine = parsed.get("medicine")
        time = parsed.get("time")

        # 🧠 STEP 2 — EMOTION DETECTION
        emotion = self.emotion_detector.detect(query, repeated)

        # 🧠 STEP 3 — CONTEXT
        if not medicine and context:
            medicine = context.get()

        if medicine and context:
            context.update(medicine)

        # 🔥 STEP 4 — EXECUTION
        if tracker:

            # ✅ CHECK
            if intent == "check_taken" and medicine:
                result = tracker.check_taken(medicine)

                if emotion == "anxious":
                    return f"{result}. You're okay — everything is on track."

                return result

            # ✅ MARK (with time awareness)
            if intent == "mark_taken" and medicine:
                result = tracker.mark_taken(medicine, time, personalization)

                if emotion == "anxious":
                    return f"{result}. You're doing well — no need to worry."

                return result

            # ✅ ADD MEDICINE (SMART + ROBUST)
            if intent == "add_medicine" and medicine:

                # Rule-based parsing
                parsed_time = self.time_parser.parse(query)

                # Normalize LLM extracted time
                if time:
                    norm = self.time_parser.parse(time)

                    if norm:
                        time = norm
                    else:
                        smart_from_time = self.smart_time_parser.parse(time)
                        if smart_from_time:
                            time = smart_from_time

                # Smart parsing from query
                smart_time = self.smart_time_parser.parse(query)

                # Final decision
                final_time = time or smart_time or parsed_time or "09:00"

                # 🧠 PERSONALIZATION
                if personalization:
                    suggested = personalization.suggest_time(medicine, final_time)

                    if suggested:
                        return (
                            f"{medicine} scheduled at {final_time}. "
                            f"You usually take it around {suggested}"
                        )

                return tracker.add_medicine(medicine, final_time)

            # ✅ LOGS
            if intent == "get_today_logs":
                return tracker.get_today_logs()

            if intent == "get_pending":
                return tracker.get_pending_medicines()

        # 🛡️ FALLBACK RULES
        if tracker:

            if "did i take" in query_lower:
                med_name = query_lower.split()[-1]
                result = tracker.check_taken(med_name)

                if emotion == "anxious":
                    return f"{result}. You're okay — everything is fine."

                return result

            if "mark" in query_lower:
                med_name = query_lower.split()[-1]
                return tracker.mark_taken(med_name, None, personalization)

            if "add" in query_lower:
                words = query_lower.split()

                if len(words) >= 2:
                    med_name = words[1]

                    smart_time = self.smart_time_parser.parse(query)
                    parsed_time = self.time_parser.parse(query)

                    final_time = smart_time or parsed_time or "09:00"

                    return tracker.add_medicine(med_name, final_time)

        # 💙 STEP 5 — LLM RESPONSE
        if emotion == "anxious":
            prompt = f"""
You are Sahay AI — a calm elderly care assistant.

User seems anxious or repeating:
"{query}"

Respond gently, calmly, and reassuringly.
Keep it short.
"""
        else:
            prompt = f"""
You are Sahay AI.

User: "{query}"

Respond clearly in simple language.
"""

        response = self.llm.invoke(prompt)
        return response.content