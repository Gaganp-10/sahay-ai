class MemoryStore:
    def __init__(self):
        # Simple lightweight in-memory storage
        self.data = []

    def add(self, text):
        if text:
            self.data.append(text)

    def search(self, query, k=3):
        """
        Simple keyword-based search
        """
        if not query:
            return []

        query = query.lower()

        matches = [
            item for item in self.data
            if query in item.lower()
        ]

        # Return latest matches
        return matches[-k:]

    def get_all(self):
        return self.data