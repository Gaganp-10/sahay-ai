"""
Sahay AI — Prescription Scanner Page

Full-featured prescription upload, OCR extraction, AI parsing,
preview cards, and one-click add-to-tracker integration.
"""

from io import BytesIO

import streamlit as st
from PIL import Image

from services.ocr_service import OCRService
from services.prescription_ai import PrescriptionAI
from ui.prescription_ui import (
    render_prescription_css,
    render_upload_zone,
    render_ocr_result,
    render_rx_meta,
    render_rx_card,
    render_explanation,
    render_added_banner,
    render_scan_empty,
)
from ui.components import render_section_header, GLASS_OPEN, GLASS_CLOSE

# ── Singletons (cached for the Streamlit session) ────────────────
@st.cache_resource
def _get_ocr():
    return OCRService()

@st.cache_resource
def _get_ai():
    return PrescriptionAI()


def render(tracker=None) -> None:
    """Main entry point called from dashboard.py."""

    st.markdown(render_prescription_css(), unsafe_allow_html=True)

    # ── Page header ──────────────────────────────────────────────
    st.markdown(
        render_section_header(
            "🔬", "Prescription Scanner",
            "Upload a prescription image — AI extracts medicines, dosages, and timings automatically"
        ),
        unsafe_allow_html=True,
    )

    # ── Upload widget ────────────────────────────────────────────
    st.markdown(render_upload_zone(), unsafe_allow_html=True)

    uploaded = st.file_uploader(
        "Choose prescription image",
        type=["jpg", "jpeg", "png", "bmp", "tiff", "webp"],
        label_visibility="collapsed",
        key="rx_uploader",
    )

    if uploaded is None:
        st.markdown(render_scan_empty(), unsafe_allow_html=True)
        return

    # ── Image preview ─────────────────────────────────────────────
    img_col, info_col = st.columns([1, 1], gap="large")

    image_bytes = uploaded.read()
    pil_image   = Image.open(BytesIO(image_bytes))

    with img_col:
        st.markdown(
            render_section_header("🖼️", "Prescription Preview", "Uploaded image"),
            unsafe_allow_html=True,
        )
        st.image(pil_image, use_container_width=True)

    # ── OCR Extraction ───────────────────────────────────────────
    with info_col:
        st.markdown(
            render_section_header("📝", "OCR Extraction", "Text extracted from image"),
            unsafe_allow_html=True,
        )

        ocr_key = f"ocr_{uploaded.name}_{uploaded.size}"
        if ocr_key not in st.session_state:
            with st.spinner("🔍 Extracting text from image…"):
                ocr_svc = _get_ocr()
                result  = ocr_svc.extract(BytesIO(image_bytes))
                st.session_state[ocr_key] = result

        ocr_result = st.session_state[ocr_key]

        if ocr_result.get("error"):
            st.error(f"OCR Error: {ocr_result['error']}")
            return

        if not ocr_result.get("clean_text"):
            st.warning("No readable text found in this image. Try a clearer photo.")
            return

        st.markdown(
            render_ocr_result(
                ocr_result["clean_text"],
                ocr_result["confidence"],
                ocr_result["word_count"],
            ),
            unsafe_allow_html=True,
        )

    # ── AI Parsing ───────────────────────────────────────────────
    st.markdown(
        render_section_header(
            "🤖", "AI Analysis",
            "GPT-4o-mini structured extraction of all medicines and dosages"
        ),
        unsafe_allow_html=True,
    )

    parse_key = f"parse_{uploaded.name}_{uploaded.size}"
    if parse_key not in st.session_state:
        with st.spinner("🧠 AI is analysing your prescription…"):
            ai_svc = _get_ai()
            parsed = ai_svc.parse(ocr_result["clean_text"])
            st.session_state[parse_key] = parsed

    parsed = st.session_state[parse_key]

    if not parsed:
        st.warning(
            "AI could not extract structured data from this prescription. "
            "The image may be too blurry or the text format is unusual."
        )
        # Show raw text as fallback
        with st.expander("📄 Show raw OCR text"):
            st.code(ocr_result["raw_text"], language=None)
        return

    medicines = parsed.get("medicines", [])

    # ── Prescription meta bar ────────────────────────────────────
    st.markdown(
        render_rx_meta(
            patient=parsed.get("patient_name"),
            doctor=parsed.get("doctor_name"),
            date=parsed.get("date"),
            diagnosis=parsed.get("diagnosis"),
        ),
        unsafe_allow_html=True,
    )

    # ── AI Explanation ───────────────────────────────────────────
    explanation = parsed.get("explanation", "")
    if explanation:
        st.markdown(render_explanation(explanation), unsafe_allow_html=True)

    # ── Medicine preview cards ───────────────────────────────────
    if not medicines:
        st.info("No specific medicines were detected. Please verify the image quality.")
    else:
        st.markdown(
            f"<div style='margin-bottom:1rem;'>"
            f"<span style='background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.2);"
            f"border-radius:50px;padding:0.3rem 1rem;font-size:0.8rem;color:#22d3ee;font-weight:600'>"
            f"💊 {len(medicines)} medicine{'s' if len(medicines) != 1 else ''} detected"
            f"</span></div>",
            unsafe_allow_html=True,
        )

        for i, med in enumerate(medicines):
            st.markdown(render_rx_card(med, i), unsafe_allow_html=True)

    # ── Add to Tracker ───────────────────────────────────────────
    if medicines and tracker:
        st.markdown(
            render_section_header(
                "➕", "Add to Medicine Schedule",
                "Select medicines to add to your daily tracker"
            ),
            unsafe_allow_html=True,
        )

        st.markdown(GLASS_OPEN, unsafe_allow_html=True)

        added_flag_key = f"added_{uploaded.name}_{uploaded.size}"

        # Checkbox for each medicine
        to_add = []
        for med in medicines:
            name  = med.get("name", "Unknown").title()
            slots = med.get("time_slots", [])
            slot_str = ", ".join(slots) if slots else "09:00"

            col_chk, col_info = st.columns([1, 5])
            with col_chk:
                checked = st.checkbox(
                    "add",
                    value=True,
                    key=f"chk_{name}_{i}",
                    label_visibility="collapsed",
                )
            with col_info:
                st.markdown(
                    f"<div style='padding-top:0.2rem'>"
                    f"<span style='color:#f1f5f9;font-weight:600'>{name}</span>"
                    f" &nbsp;<span style='color:#475569;font-size:0.8rem'>→ {slot_str}</span>"
                    f"</div>",
                    unsafe_allow_html=True,
                )

            if checked:
                to_add.append(med)

        st.markdown(GLASS_CLOSE, unsafe_allow_html=True)

        if st.button(
            f"➕ Add {len(to_add)} Medicine{'s' if len(to_add) != 1 else ''} to Schedule",
            key="add_meds_btn",
            use_container_width=True,
            disabled=(not to_add or st.session_state.get(added_flag_key, False)),
        ):
            successfully_added = []
            for med in to_add:
                name  = (med.get("name") or "medicine").lower().strip()
                slots = med.get("time_slots", ["09:00"])

                for slot in (slots if slots else ["09:00"]):
                    if slot == "SOS":
                        continue
                    if tracker:
                        tracker.add_medicine(name, slot)

                successfully_added.append(name)

            st.session_state[added_flag_key] = True
            st.markdown(
                render_added_banner(successfully_added),
                unsafe_allow_html=True,
            )
            st.rerun()

        if st.session_state.get(added_flag_key, False):
            added_names = [m.get("name", "medicine").lower() for m in to_add]
            st.markdown(
                render_added_banner(added_names),
                unsafe_allow_html=True,
            )

    elif medicines and not tracker:
        st.info("Medicine tracker not connected — medicines cannot be added automatically.")
