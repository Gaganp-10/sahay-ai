import os
from twilio.rest import Client
from dotenv import load_dotenv

try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except:
    TWILIO_AVAILABLE = False


class CaregiverService:
    def __init__(self):
        self.enabled = TWILIO_AVAILABLE

        if self.enabled:
            self.client = Client(
                os.getenv("TWILIO_ACCOUNT_SID"),
                os.getenv("TWILIO_AUTH_TOKEN")
            )

            self.from_phone = os.getenv("TWILIO_PHONE")
            self.to_phone = os.getenv("CAREGIVER_PHONE")

    def send_alert(self, message):
        if not self.enabled:
            print("⚠️ Twilio not configured.")
            return

        try:
            self.client.messages.create(
                body=message,
                from_=self.from_phone,
                to=self.to_phone
            )

            print("📩 Caregiver alert sent.")

        except Exception as e:
            print("Twilio Error:", e)