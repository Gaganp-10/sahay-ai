"""
Sahay AI — Upgraded OCR Service

Auto-detects the local tesseract.exe bundled with the project,
performs multi-pass image preprocessing for better extraction,
and returns a rich result dict.
"""

import os
import re
from pathlib import Path

import pytesseract
from PIL import Image, ImageEnhance, ImageFilter


# ── Auto-detect tesseract ────────────────────────────────────────
def _find_tesseract() -> str:
    """
    Search for tesseract in order of priority:
    1. TESSERACT_CMD env var
    2. tesseract.exe bundled in project root
    3. System PATH
    """
    env = os.getenv("TESSERACT_CMD")
    if env and Path(env).exists():
        return env

    # Project root (medi-app/) bundled binary
    project_root = Path(__file__).resolve().parents[2]
    bundled = project_root / "tesseract.exe"
    if bundled.exists():
        return str(bundled)

    # Fallback — hope it's on PATH
    return "tesseract"


pytesseract.pytesseract.tesseract_cmd = _find_tesseract()


def _preprocess(image: Image.Image) -> Image.Image:
    """Enhance image quality for better OCR accuracy."""
    # Convert to RGB if needed
    if image.mode not in ("RGB", "L"):
        image = image.convert("RGB")

    # Scale up small images
    w, h = image.size
    if w < 1000:
        scale = 1000 / w
        image = image.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    # Sharpen + increase contrast
    image = image.filter(ImageFilter.SHARPEN)
    image = ImageEnhance.Contrast(image).enhance(2.0)
    image = ImageEnhance.Sharpness(image).enhance(2.0)
    return image


class OCRService:
    """
    Upgraded OCR service with preprocessing, confidence scoring,
    and clean text normalisation.
    """

    def extract_text(self, image_source) -> str:
        """
        Legacy method — kept for backwards compatibility with existing code.

        Args:
            image_source: File path string or PIL Image.
        Returns:
            Raw extracted text string.
        """
        result = self.extract(image_source)
        return result.get("raw_text", "")

    def extract(self, image_source) -> dict:
        """
        Full extraction returning a rich result dict.

        Args:
            image_source: File path (str/Path) or PIL Image or file-like bytes.

        Returns:
            {
                "raw_text":   str  — raw tesseract output,
                "clean_text": str  — normalised, de-noised text,
                "word_count": int,
                "confidence": float  — avg tesseract confidence 0-100,
                "error":      str|None,
            }
        """
        try:
            # Load image
            if isinstance(image_source, Image.Image):
                image = image_source
            elif hasattr(image_source, "read"):
                image = Image.open(image_source)
            else:
                image = Image.open(str(image_source))

            enhanced = _preprocess(image)

            # Run OCR with confidence data
            data = pytesseract.image_to_data(
                enhanced,
                output_type=pytesseract.Output.DICT,
                config="--psm 6",
            )

            # Confidence — only non-empty words
            confs = [
                int(c) for c, txt in zip(data["conf"], data["text"])
                if txt.strip() and int(c) >= 0
            ]
            avg_conf = round(sum(confs) / len(confs), 1) if confs else 0.0

            raw_text = pytesseract.image_to_string(
                enhanced, config="--psm 6"
            ).strip()

            clean_text = self._clean(raw_text)

            return {
                "raw_text":   raw_text,
                "clean_text": clean_text,
                "word_count": len(clean_text.split()),
                "confidence": avg_conf,
                "error":      None,
            }

        except Exception as e:
            return {
                "raw_text":   "",
                "clean_text": "",
                "word_count": 0,
                "confidence": 0.0,
                "error":      str(e),
            }

    # ── Private helpers ─────────────────────────────────────────

    @staticmethod
    def _clean(text: str) -> str:
        """Remove noise characters, collapse whitespace."""
        # Drop lines that are mostly noise (< 3 alphanumeric chars)
        lines = []
        for line in text.splitlines():
            alnum = re.sub(r"[^a-zA-Z0-9]", "", line)
            if len(alnum) >= 2:
                lines.append(line.strip())
        clean = "\n".join(lines)
        # Collapse multiple spaces
        clean = re.sub(r" {2,}", " ", clean)
        return clean.strip()