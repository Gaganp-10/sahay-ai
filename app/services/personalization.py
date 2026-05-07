from datetime import datetime, timedelta


class PersonalizationEngine:
    def __init__(self):
        # { "paracetamol": [delay_in_minutes, ...] }
        self.history = {}

    def record(self, medicine, scheduled_time, taken_time):
        try:
            s = datetime.strptime(scheduled_time, "%H:%M")
            t = datetime.strptime(taken_time, "%H:%M")

            delay = int((t - s).total_seconds() / 60)

            if medicine not in self.history:
                self.history[medicine] = []

            self.history[medicine].append(delay)

        except:
            pass

    def get_average_delay(self, medicine):
        if medicine not in self.history or not self.history[medicine]:
            return 0

        return int(sum(self.history[medicine]) / len(self.history[medicine]))

    def suggest_time(self, medicine, scheduled_time):
        avg_delay = self.get_average_delay(medicine)

        if abs(avg_delay) < 5:
            return None  # no need to adjust

        base = datetime.strptime(scheduled_time, "%H:%M")
        adjusted = base + timedelta(minutes=avg_delay)

        return adjusted.strftime("%H:%M")