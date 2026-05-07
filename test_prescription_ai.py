from app.services.ocr_service import OCRService
from app.services.prescription_parser import PrescriptionParser

ocr = OCRService()
parser = PrescriptionParser()

# Extract OCR text
text = """
PARACIP-500
Take after dinner
"""

print("\n📄 OCR TEXT:\n")
print(text)

# AI parse
result = parser.parse(text)

print("\n🧠 AI UNDERSTANDING:\n")
print(result)