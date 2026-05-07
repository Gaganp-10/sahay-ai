class TimeParser:
    def __init__(self):
        self.time_map = {
            "morning": "08:00",
            "afternoon": "13:00",
            "evening": "18:00",
            "night": "21:00",
            "after breakfast": "09:00",
            "after lunch": "14:00",
            "after dinner": "21:30",
            "before sleep": "22:00"
        }

    def parse(self, text):
        text = text.lower()

        for key in self.time_map:
            if key in text:
                return self.time_map[key]

        return None