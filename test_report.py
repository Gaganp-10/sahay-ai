from app.core.system import system
from app.services.insight_engine import InsightEngine
from app.services.report_service import ReportService

tracker = system.tracker

# Fake sample data if empty
if not tracker.logs:
    tracker.logs.append({
        "medicine": "paracetamol",
        "scheduled_time": "09:00",
        "taken_time": "09:10",
        "date": "2026-01-01"
    })

engine = InsightEngine()

insights = engine.generate(tracker)

report = ReportService()

file = report.generate(
    tracker,
    insights
)

print("✅ Report generated:", file)