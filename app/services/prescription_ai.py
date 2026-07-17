"""
Sahay AI — Prescription AI Service

Uses GPT-4o-mini with structured JSON output to extract:
  - Medicine names
  - Dosage (strength + unit)
  - Frequency (times per day)
  - Timing (morning / afternoon / evening / night → HH:MM)
  - Duration
  - Special instructions
  - Plain-language AI explanation for elderly patients
"""

import json
import os
import re
from typing import List, Optional

from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()

# ── Timing normalisation map ─────────────────────────────────────
TIMING_MAP = {
    "morning":       "08:00",
    "breakfast":     "08:00",
    "after breakfast":"08:30",
    "noon":          "12:00",
    "lunch":         "13:00",
    "afternoon":     "14:00",
    "evening":       "18:00",
    "dinner":        "20:00",
    "after dinner":  "20:30",
    "night":         "21:00",
    "bedtime":       "22:00",
    "before sleep":  "22:00",
    "before bed":    "22:00",
    "sos":           "SOS",
    "as needed":     "SOS",
}

_SYSTEM = """You are a medical AI that extracts structured data from prescription text.
Return ONLY valid JSON — no markdown, no explanation, no code fences.

Extract every medicine mentioned and return this exact structure:
{
  "medicines": [
    {
      "name": "string (generic name preferred)",
      "brand": "string or null",
      "dosage": "string (e.g. '500mg', '10ml') or null",
      "frequency": "string (e.g. 'once daily', 'twice daily', 'TDS') or null",
      "timings": ["morning", "evening"],
      "duration": "string (e.g. '5 days', '1 month') or null",
      "instructions": "string (e.g. 'take after food') or null",
      "time_slots": ["08:00", "18:00"]
    }
  ],
  "patient_name": "string or null",
  "doctor_name": "string or null",
  "date": "string or null",
  "diagnosis": "string or null",
  "explanation": "string — a plain, friendly explanation of this prescription in 2-3 sentences as if explaining to an elderly patient"
}

Rules:
- time_slots: convert timings to 24h HH:MM using: morning→08:00, afternoon→14:00, evening→18:00, night→21:00
- If a timing word maps to a known slot, include it in time_slots
- frequency like "TDS" = three times daily = ["morning","afternoon","night"]
- frequency like "BD" = twice daily = ["morning","evening"]
- If unsure about a field, use null
- Always populate explanation in simple English
"""


class PrescriptionAI:
    """
    AI-powered prescription parser using GPT-4o-mini structured output.
    Replaces the old MistralAI-based PrescriptionParser.
    """

    def __init__(self):
        self._llm = ChatMistralAI(
            model="mistral-small",
            temperature=0.1,
            max_tokens=1024,
            api_key=os.getenv("MISTRAL_API_KEY"),
        )

    def parse(self, ocr_text: str) -> Optional[dict]:
        """
        Parse raw OCR text into a structured prescription dict.

        Args:
            ocr_text: Raw text extracted from a prescription image.

        Returns:
            Structured dict with 'medicines', 'explanation', etc.
            Returns None on failure.
        """
        if not ocr_text or len(ocr_text.strip()) < 5:
            return None

        messages = [
            SystemMessage(content=_SYSTEM),
            HumanMessage(content=f"Prescription text:\n\n{ocr_text}"),
        ]

        try:
            response = self._llm.invoke(messages).content.strip()
            # Strip markdown code fences if present
            response = re.sub(r"```(?:json)?", "", response).strip().strip("`")
            data = json.loads(response)

            # Post-process: normalise time_slots
            for med in data.get("medicines", []):
                med["time_slots"] = self._normalise_slots(
                    med.get("timings", []),
                    med.get("time_slots", []),
                )

            return data

        except (json.JSONDecodeError, Exception):
            return None

    def explain(self, prescription_data: dict) -> str:
        """
        Generate a patient-friendly explanation of the full prescription.
        Falls back to the explanation field already in the parsed data.
        """
        return prescription_data.get(
            "explanation",
            "Please ask your doctor or pharmacist to explain this prescription.",
        )

    # ── Helpers ─────────────────────────────────────────────────

    @staticmethod
    def _normalise_slots(timings: list, existing_slots: list) -> list:
        """
        Map timing words to HH:MM slots, merging with any already-parsed slots.
        Deduplicates and sorts the result.
        """
        slots = set(existing_slots or [])
        for t in (timings or []):
            mapped = TIMING_MAP.get(t.lower().strip())
            if mapped:
                slots.add(mapped)
        return sorted(slots)
