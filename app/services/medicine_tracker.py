from datetime import datetime
import sqlite3


class MedicineTracker:
    def __init__(self):
        self.logs = []

        # Runtime cache
        self.medicines = {}

        self.load_from_db()

    # 🔄 LOAD EXISTING DATA
    def load_from_db(self):
        conn = sqlite3.connect("sahay.db")
        cursor = conn.cursor()

        cursor.execute("""
        SELECT medicine, scheduled_time
        FROM medicines
        """)

        rows = cursor.fetchall()

        for med, time in rows:
            if med not in self.medicines:
                self.medicines[med] = []

            self.medicines[med].append({
                "time": time,
                "added_at": datetime.now()
            })

        conn.close()

    # ✅ ADD MEDICINE
    def add_medicine(self, name, time):
        name = name.lower()

        if name not in self.medicines:
            self.medicines[name] = []

        # Prevent duplicates
        for entry in self.medicines[name]:
            if entry["time"] == time:
                return f"{name} already scheduled at {time}"

        entry = {
            "time": time,
            "added_at": datetime.now()
        }

        self.medicines[name].append(entry)

        # 💾 SAVE TO DB
        conn = sqlite3.connect("sahay.db")
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO medicines (
            medicine,
            scheduled_time,
            added_at
        )
        VALUES (?, ?, ?)
        """, (
            name,
            time,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))

        conn.commit()
        conn.close()

        return f"{name} scheduled at {time}"

    # ✅ MARK AS TAKEN
    def mark_taken(self, name, taken_time=None, personalization=None):
        name = name.lower()

        now = datetime.now()

        today = now.strftime("%Y-%m-%d")

        time_now = (
            taken_time
            if taken_time
            else now.strftime("%H:%M")
        )

        if name not in self.medicines:
            return f"{name} is not scheduled."

        closest_time = None
        min_diff = float("inf")

        for entry in self.medicines[name]:
            t = entry["time"]

            scheduled = datetime.strptime(
                t,
                "%H:%M"
            ).replace(
                year=now.year,
                month=now.month,
                day=now.day
            )

            diff = abs(
                (scheduled - now).total_seconds()
            )

            if diff < min_diff:
                min_diff = diff
                closest_time = t

        log = {
            "medicine": name,
            "scheduled_time": closest_time,
            "taken_time": time_now,
            "date": today
        }

        self.logs.append(log)

        # 💾 SAVE LOG TO DB
        conn = sqlite3.connect("sahay.db")
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO medicine_logs (
            medicine,
            scheduled_time,
            taken_time,
            date
        )
        VALUES (?, ?, ?, ?)
        """, (
            name,
            closest_time,
            time_now,
            today
        ))

        conn.commit()
        conn.close()

        # 🧠 PERSONALIZATION
        if personalization:
            personalization.record(
                name,
                closest_time,
                time_now
            )

        return (
            f"{name} ({closest_time}) "
            f"marked as taken at {time_now}"
        )

    # ✅ CHECK
    def check_taken(self, name):
        name = name.lower()

        for log in reversed(self.logs):
            if log["medicine"] == name:
                return (
                    f"Yes, you took {name} "
                    f"({log['scheduled_time']}) "
                    f"at {log['taken_time']}"
                )

        return f"No record of taking {name}"

    # ✅ TODAY LOGS
    def get_today_logs(self):
        today = datetime.now().strftime("%Y-%m-%d")

        today_logs = [
            log for log in self.logs
            if log["date"] == today
        ]

        if not today_logs:
            return "You have not taken any medicines today."

        response = "Today you took:\n"

        for log in today_logs:
            response += (
                f"- {log['medicine']} "
                f"({log['scheduled_time']}) "
                f"at {log['taken_time']}\n"
            )

        return response

    # ✅ PENDING
    def get_pending_medicines(self):
        today = datetime.now().strftime("%Y-%m-%d")

        taken = {
            (
                log["medicine"],
                log["scheduled_time"]
            )
            for log in self.logs
            if log["date"] == today
        }

        pending = []

        for med, entries in self.medicines.items():
            for entry in entries:
                t = entry["time"]

                if (med, t) not in taken:
                    pending.append(f"{med} ({t})")

        if not pending:
            return "All medicines taken for today."

        return "Pending doses: " + ", ".join(pending)