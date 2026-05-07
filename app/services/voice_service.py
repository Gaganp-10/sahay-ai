import speech_recognition as sr
import pyttsx3


class VoiceService:
    def __init__(self):
        self.recognizer = sr.Recognizer()

        self.engine = pyttsx3.init()
        self.engine.setProperty("rate", 150)

    # 🎤 Speech → Text
    def listen(self):
        with sr.Microphone() as source:
            print("🎤 Listening...")

            audio = self.recognizer.listen(source)

            try:
                text = self.recognizer.recognize_google(audio)

                print("You said:", text)

                return text

            except Exception:
                return None

    # 🔊 Text → Speech
    def speak(self, text):
        self.engine.say(text)
        self.engine.runAndWait()