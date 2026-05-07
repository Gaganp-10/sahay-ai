class EmotionDetector:
    def detect(self, query, repeated):
        query = query.lower()

        # Anxiety patterns
        anxiety_keywords = [
            "are you sure",
            "really",
            "again",
            "did i",
            "i forgot",
            "not sure"
        ]

        if repeated:
            return "anxious"

        for word in anxiety_keywords:
            if word in query:
                return "anxious"

        return "normal"