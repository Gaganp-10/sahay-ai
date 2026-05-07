from app.db.database import init_db
from app.services.medicine_tracker import MedicineTracker
from app.services.reminder_service import ReminderService
from app.services.caregiver_service import CaregiverService


class SahaySystem:
    def __init__(self):
        # ✅ CREATE DB/TABLES FIRST
        init_db()

        # ✅ THEN LOAD SERVICES
        self.tracker = MedicineTracker()

        self.reminder = ReminderService(
            self.tracker
        )

        self.caregiver = CaregiverService()


# 🌍 Global shared system
system = SahaySystem()