from db.database import init_db
from services.medicine_tracker import MedicineTracker
from services.reminder_service import ReminderService
from services.caregiver_service import CaregiverService


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