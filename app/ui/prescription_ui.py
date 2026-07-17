"""
Sahay AI — Prescription UI Components

Glassmorphism CSS + HTML renderers for the prescription scanner page.
Matches the existing premium design system from ui/styles.py.
"""

# ────────────────────────────────────────────────────────────────
# PAGE CSS
# ────────────────────────────────────────────────────────────────
PRESCRIPTION_CSS = """
<style>

/* ── Upload zone ── */
.upload-zone {
    border: 2px dashed rgba(6,182,212,0.3);
    border-radius: 24px;
    padding: 3rem 2rem;
    text-align: center;
    background: rgba(6,182,212,0.04);
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
    animation: fadeInUp 0.5s ease;
}
.upload-zone:hover {
    border-color: rgba(6,182,212,0.6);
    background: rgba(6,182,212,0.07);
}
.upload-icon { font-size: 3rem; margin-bottom: 0.75rem; display: block; opacity: 0.7; }
.upload-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 0.4rem;
}
.upload-sub { font-size: 0.82rem; color: #475569; }

/* ── OCR result box ── */
.ocr-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-left: 3px solid #06b6d4;
    border-radius: 16px;
    padding: 1.4rem 1.6rem;
    margin-bottom: 1.5rem;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 0.82rem;
    color: #94a3b8;
    line-height: 1.8;
    max-height: 220px;
    overflow-y: auto;
    animation: fadeInUp 0.4s ease;
}
.ocr-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 0.75rem;
}
.ocr-header-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    color: #22d3ee;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}
.ocr-confidence {
    margin-left: auto;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 50px;
    padding: 0.15rem 0.6rem;
    font-size: 0.7rem;
    color: #34d399;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
}

/* ── Prescription preview card ── */
.rx-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    padding: 0;
    overflow: hidden;
    margin-bottom: 1.25rem;
    animation: fadeInUp 0.5s ease both;
    transition: all 0.3s ease;
}
.rx-card:hover {
    border-color: rgba(6,182,212,0.2);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(6,182,212,0.08);
    transform: translateY(-3px);
}
.rx-card-header {
    background: linear-gradient(135deg, rgba(6,182,212,0.12), rgba(59,130,246,0.08));
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 1.1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
.rx-card-icon {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 0 16px rgba(6,182,212,0.3);
    flex-shrink: 0;
}
.rx-med-name {
    font-family: 'Outfit', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.01em;
}
.rx-brand {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 1px;
}
.rx-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.rx-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 0.22rem 0.65rem;
    border-radius: 50px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}
.badge-dosage  { background:rgba(139,92,246,0.12); border:1px solid rgba(139,92,246,0.25); color:#a78bfa; }
.badge-freq    { background:rgba(6,182,212,0.10);  border:1px solid rgba(6,182,212,0.22);  color:#22d3ee; }
.badge-dur     { background:rgba(245,158,11,0.10); border:1px solid rgba(245,158,11,0.22); color:#fbbf24; }

.rx-card-body { padding: 1.2rem 1.5rem; }

/* Timing slots row */
.rx-slots { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1rem; }
.rx-slot {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 0.5rem 0.9rem;
    text-align: center;
    min-width: 72px;
    transition: all 0.2s ease;
}
.rx-slot:hover { border-color: rgba(6,182,212,0.3); background: rgba(6,182,212,0.06); }
.rx-slot-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.95rem;
    font-weight: 700;
    color: #06b6d4;
    display: block;
}
.rx-slot-label { font-size: 0.65rem; color: #475569; text-transform: uppercase; letter-spacing: 0.06em; }

/* Instructions */
.rx-instruction {
    background: rgba(245,158,11,0.06);
    border: 1px solid rgba(245,158,11,0.14);
    border-radius: 10px;
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    color: #fbbf24;
    display: flex; align-items: center; gap: 8px;
}

/* ── AI Explanation card ── */
.rx-explanation {
    background: linear-gradient(135deg, rgba(139,92,246,0.07), rgba(59,130,246,0.05));
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 20px;
    padding: 1.4rem 1.6rem;
    margin-bottom: 1.5rem;
    animation: fadeInUp 0.6s ease;
}
.rx-explanation-title {
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #c4b5fd;
    margin-bottom: 0.6rem;
    display: flex; align-items: center; gap: 8px;
}
.rx-explanation-text {
    font-size: 0.9rem;
    color: #cbd5e1;
    line-height: 1.75;
}

/* ── Prescription meta (doctor, date, patient) ── */
.rx-meta {
    display: flex; gap: 1.5rem; flex-wrap: wrap;
    padding: 1rem 1.5rem;
    background: rgba(255,255,255,0.02);
    border-top: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 1.5rem;
    border-radius: 0 0 20px 20px;
}
.rx-meta-item { font-size: 0.8rem; }
.rx-meta-label { color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; font-size: 0.67rem; }
.rx-meta-value { color: #94a3b8; margin-top: 2px; }

/* ── Add-to-tracker success banner ── */
.added-banner {
    background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.07));
    border: 1px solid rgba(16,185,129,0.22);
    border-radius: 14px;
    padding: 0.9rem 1.3rem;
    display: flex; align-items: center; gap: 10px;
    font-size: 0.85rem;
    color: #34d399;
    margin-top: 0.5rem;
    animation: fadeInUp 0.3s ease;
}

/* ── Empty/error states ── */
.scan-empty {
    text-align: center; padding: 4rem 2rem;
}
.scan-empty-icon { font-size: 3.5rem; opacity: 0.3; display: block; margin-bottom: 1rem; }
.scan-empty-title { font-family:'Outfit',sans-serif; font-size:1.2rem; font-weight:700; color:#475569; margin-bottom:0.5rem; }
.scan-empty-sub { font-size:0.82rem; color:#334155; }

/* ── Animations ── */
@keyframes fadeInUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
}

</style>
"""

# ── Timing label map ────────────────────────────────────────────
_SLOT_LABELS = {
    "08:00": "Morning",  "08:30": "Morning",
    "12:00": "Noon",     "13:00": "Lunch",
    "14:00": "Afternoon","18:00": "Evening",
    "20:00": "Dinner",   "20:30": "Dinner",
    "21:00": "Night",    "22:00": "Bedtime",
    "SOS":   "As Needed",
}


# ────────────────────────────────────────────────────────────────
# Component renderers
# ────────────────────────────────────────────────────────────────

def render_prescription_css() -> str:
    return PRESCRIPTION_CSS


def render_upload_zone() -> str:
    return """
    <div class="upload-zone">
        <span class="upload-icon">🔬</span>
        <div class="upload-title">Upload Prescription Image</div>
        <div class="upload-sub">
            Supports JPG, PNG, JPEG · Max 10 MB<br>
            Handwritten or printed prescriptions accepted
        </div>
    </div>
    """


def render_ocr_result(clean_text: str, confidence: float, word_count: int) -> str:
    conf_color = "#34d399" if confidence >= 70 else "#fbbf24" if confidence >= 40 else "#f43f5e"
    escaped = clean_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return f"""
    <div class="ocr-box">
        <div class="ocr-header">
            <span class="ocr-header-label">📝 Extracted Text — {word_count} words</span>
            <span class="ocr-confidence" style="border-color:rgba(52,211,153,0.2);color:{conf_color}">
                {confidence}% confidence
            </span>
        </div>
        <pre style="margin:0;white-space:pre-wrap;font-family:inherit">{escaped}</pre>
    </div>
    """


def render_rx_meta(patient: str, doctor: str, date: str, diagnosis: str) -> str:
    items = [
        ("Patient", patient or "—"),
        ("Doctor",  doctor  or "—"),
        ("Date",    date    or "—"),
        ("Diagnosis", diagnosis or "—"),
    ]
    inner = "".join(
        f"<div class='rx-meta-item'>"
        f"<div class='rx-meta-label'>{label}</div>"
        f"<div class='rx-meta-value'>{value}</div>"
        f"</div>"
        for label, value in items
    )
    return f"<div class='rx-meta'>{inner}</div>"


def render_rx_card(med: dict, index: int = 0) -> str:
    name        = (med.get("name") or "Unknown Medicine").title()
    brand       = med.get("brand") or ""
    dosage      = med.get("dosage") or ""
    frequency   = med.get("frequency") or ""
    duration    = med.get("duration") or ""
    instructions= med.get("instructions") or ""
    time_slots  = med.get("time_slots") or []

    brand_html = f"<div class='rx-brand'>{brand}</div>" if brand else ""

    # Badges
    badges = ""
    if dosage:
        badges += f"<span class='rx-badge badge-dosage'>💊 {dosage}</span>"
    if frequency:
        badges += f"<span class='rx-badge badge-freq'>🔁 {frequency}</span>"
    if duration:
        badges += f"<span class='rx-badge badge-dur'>📅 {duration}</span>"

    # Time slots
    slots_html = ""
    if time_slots:
        slot_items = ""
        for slot in time_slots:
            label = _SLOT_LABELS.get(slot, slot)
            slot_items += f"""
            <div class="rx-slot">
                <span class="rx-slot-time">{slot}</span>
                <span class="rx-slot-label">{label}</span>
            </div>"""
        slots_html = f"<div class='rx-slots'>{slot_items}</div>"
    else:
        slots_html = "<div style='color:#475569;font-size:0.8rem;margin-bottom:0.8rem'>No specific timing extracted</div>"

    # Instructions
    instr_html = ""
    if instructions:
        instr_html = f"""
        <div class="rx-instruction">
            ℹ️ {instructions}
        </div>"""

    return f"""
    <div class="rx-card" style="animation-delay:{index * 0.12}s">
        <div class="rx-card-header">
            <div style="display:flex;align-items:center;gap:12px">
                <div class="rx-card-icon">💊</div>
                <div>
                    <div class="rx-med-name">{name}</div>
                    {brand_html}
                </div>
            </div>
            <div class="rx-badges">{badges}</div>
        </div>
        <div class="rx-card-body">
            {slots_html}
            {instr_html}
        </div>
    </div>
    """


def render_explanation(text: str) -> str:
    return f"""
    <div class="rx-explanation">
        <div class="rx-explanation-title">🤖 AI Explanation for Patient</div>
        <div class="rx-explanation-text">{text}</div>
    </div>
    """


def render_added_banner(medicines: list) -> str:
    names = ", ".join(m.title() for m in medicines)
    return f"""
    <div class="added-banner">
        ✅ <strong>{names}</strong> added to your medicine schedule!
    </div>
    """


def render_scan_empty() -> str:
    return """
    <div class="scan-empty">
        <span class="scan-empty-icon">🔬</span>
        <div class="scan-empty-title">No Prescription Scanned Yet</div>
        <div class="scan-empty-sub">
            Upload a prescription image above to extract<br>
            medicines, dosages, and timings automatically.
        </div>
    </div>
    """
