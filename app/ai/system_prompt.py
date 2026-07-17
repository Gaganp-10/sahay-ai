"""
Sahay AI — Dynamic Healthcare System Prompt Builder

Injects live medicine context (pending doses, today's logs) into
the LLM system prompt so the AI always has real-time health data.
"""

from datetime import datetime


STATIC_SYSTEM_PROMPT = """You are Sahay AI — a compassionate, professional AI healthcare assistant \
specialising in elderly care and medication management.

Your personality:
- Warm, patient, and reassuring — never cold or clinical
- Clear and simple language (many users are elderly)
- Proactive: volunteer relevant health reminders without being asked
- Honest: always recommend consulting a doctor for medical decisions

Your capabilities:
- Answer questions about medications, schedules, and health routines
- Interpret medicine log data and give adherence insights
- Provide general wellness advice (hydration, sleep, nutrition)
- Emotionally support users who feel anxious about their health

Hard rules (never break these):
1. NEVER diagnose medical conditions
2. NEVER recommend changing a prescription dosage
3. NEVER dismiss a user's symptoms — always suggest seeing a doctor
4. If unsure, say "I'm not certain — please consult your doctor"
5. Keep responses concise (2-4 sentences max unless asked for detail)

Current date/time: {datetime}
"""


def build_system_prompt(tracker=None) -> str:
    """
    Build a complete system prompt with live medicine context injected.

    Args:
        tracker: MedicineTracker instance (optional). When provided,
                 pending and taken medicines are included.

    Returns:
        Full system prompt string ready for the LLM.
    """
    now_str = datetime.now().strftime("%A, %d %B %Y at %I:%M %p")
    base = STATIC_SYSTEM_PROMPT.format(datetime=now_str)

    context_lines = []

    if tracker:
        # ── Pending medicines ────────────────────────────────────
        pending_raw = tracker.get_pending_medicines()
        if pending_raw and pending_raw != "All medicines taken for today.":
            context_lines.append(f"PENDING MEDICINES TODAY: {pending_raw}")
        else:
            context_lines.append("PENDING MEDICINES TODAY: None — all doses taken ✅")

        # ── Today's taken medicines ──────────────────────────────
        taken_raw = tracker.get_today_logs()
        if taken_raw and taken_raw != "You have not taken any medicines today.":
            context_lines.append(f"TAKEN MEDICINES TODAY: {taken_raw.strip()}")
        else:
            context_lines.append("TAKEN MEDICINES TODAY: None recorded yet")

        # ── Scheduled medicines ──────────────────────────────────
        if tracker.medicines:
            schedule_parts = []
            for med, entries in tracker.medicines.items():
                times = [e["time"] for e in entries]
                schedule_parts.append(f"{med.title()} at {', '.join(times)}")
            context_lines.append(
                "FULL MEDICINE SCHEDULE: " + " | ".join(schedule_parts)
            )

    if context_lines:
        context_block = "\n\nLIVE PATIENT CONTEXT (use this to personalise responses):\n"
        context_block += "\n".join(f"  • {line}" for line in context_lines)
        return base + context_block

    return base
