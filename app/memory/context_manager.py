class ContextManager:
    def __init__(self):
        self.last_medicine = None

    def update(self, medicine):
        if medicine:
            self.last_medicine = medicine

    def get(self):
        return self.last_medicine