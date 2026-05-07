from app.memory.memory import MemoryStore
from app.utils.doubt_detector import is_repeated_question
from app.agents.assistant import SahayAssistant
from app.memory.context_manager import ContextManager
from app.services.personalization import PersonalizationEngine
from app.core.system import system
from app.services.voice_service import VoiceService

# 🔧 Initialize systems
memory = MemoryStore()
assistant = SahayAssistant()

tracker = system.tracker
reminder = system.reminder
caregiver = system.caregiver

context = ContextManager()
personalization = PersonalizationEngine()
voice = VoiceService()

past_queries = []

print("🧠 Medi-App (Sahay AI) Running...\n")

while True:
    try:
        # 🔔 CHECK REMINDERS
        reminders = reminder.check_reminders()

        for r in reminders:
            print("🔔 Reminder:", r)
            voice.speak(r)

        # ❗ CHECK MISSED MEDICINES
        missed = reminder.check_missed()

        if missed:
            msg = ", ".join(missed)

            print("⚠️ Missed medicines:", msg)

            caregiver.send_alert(f"Missed medicines: {msg}")

        # 🎤 INPUT MODE
        mode = input("\nType or Voice? (t/v): ").strip().lower()

        # 🎤 VOICE INPUT
        if mode == "v":
            query = voice.listen()

            if not query:
                print("Sahay: Sorry, I couldn't hear you.")
                voice.speak("Sorry, I couldn't hear you.")
                continue

        # ⌨️ TEXT INPUT
        else:
            query = input("You: ").strip()

        # 🛑 Empty query
        if not query:
            continue

        # 🚪 Exit
        if query.lower() == "exit":
            goodbye = "Take care! Goodbye."
            print("Sahay:", goodbye)
            voice.speak(goodbye)
            break

        # 🔁 Detect repeated queries
        repeated = is_repeated_question(query, past_queries)

        # 🤖 Generate response
        response = assistant.respond(
            query=query,
            repeated=repeated,
            tracker=tracker,
            context=context,
            personalization=personalization
        )

        # 🖨️ Print response
        print("Sahay:", response)

        # 🔊 Voice response
        voice.speak(response)

        # 🧠 Store memory
        memory.add(query)
        past_queries.append(query)

    except KeyboardInterrupt:
        print("\nSahay: Goodbye! 👋")
        voice.speak("Goodbye")
        break

    except Exception as e:
        print("Sahay: Something went wrong.")
        print("Error:", e)