import pytesseract
from PIL import Image


class OCRService:
    def extract_text(self, image_path):
        try:
            image = Image.open(image_path)

            text = pytesseract.image_to_string(image)

            return text.strip()

        except Exception as e:
            return f"OCR Error: {e}"