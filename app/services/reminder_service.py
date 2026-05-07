from datetime import datetime, timedelta

class ReminderService:
    def __init__(self, tracker):
        self.tracker = tracker
        self.triggered_reminders = set()  # prevent duplicate reminders

    # 🔔 CHECK REMINDERS (MULTI-TIME SUPPORT)
    def check_reminders(self):
        now = datetime.now()
        reminders = []

        for med, times in self.tracker.medicines.items():
            for t in times:
                try:
                    scheduled_dt = datetime.strptime(t, "%H:%M").replace(
                        year=now.year,
                        month=now.month,
                        day=now.day
                    )

                    # ⏱️ Trigger within 60-second window
                    diff = abs((scheduled_dt - now).total_seconds())

                    key = f"{med}_{t}"

                    if diff < 60 and key not in self.triggered_reminders:
                        reminders.append(f"Time to take {med}")
                        self.triggered_reminders.add(key)

                except:
                    continue

        return reminders

    # ❗ CHECK MISSED MEDICINES (MULTI-TIME + GRACE)
    def check_missed(self):
        now = datetime.now()
        missed = []

        today = now.strftime("%Y-%m-%d")

        for med, entries in self.tracker.medicines.items():
            for entry in entries:
                try:
                    t = entry["time"]
                    added_at = entry["added_at"]

                    scheduled_dt = datetime.strptime(t, "%H:%M").replace(
                        year=now.year,
                        month=now.month,
                        day=now.day
                    )

                    # 🧠 30-minute grace after scheduled time
                    grace_time = scheduled_dt + timedelta(minutes=30)

                    # 🧠 1-hour grace after adding medicine (VERY IMPORTANT)
                    if (now - added_at).total_seconds() < 3600:
                        continue

                    if now > grace_time:
                        # Check if this specific dose was taken
                        taken = any(
                            log["medicine"] == med and
                            log["scheduled_time"] == t and
                            log["date"] == today
                            for log in self.tracker.logs
                        )

                        if not taken:
                            missed.append(f"{med} ({t})")

                except:
                    continue

        return missed