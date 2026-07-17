"""
Sahay AI — Reusable UI Components v2.0
Each function returns an HTML string for use with st.markdown(unsafe_allow_html=True).
"""

from datetime import datetime


# ────────────────────────────────────────────────────────────────
# NAVBAR
# ────────────────────────────────────────────────────────────────
def render_navbar(page_name: str) -> str:
    now = datetime.now().strftime("%d %b %Y, %I:%M %p")
    return f"""
    <div class="sahay-navbar">
        <div>
            <div class="navbar-brand">🧠 Sahay AI</div>
            <div class="navbar-sub">Intelligent Healthcare Platform &nbsp;·&nbsp; {page_name} &nbsp;·&nbsp; {now}</div>
        </div>
        <div class="navbar-status">
            <span class="status-dot"></span>
            System Online
        </div>
    </div>
    """


# ────────────────────────────────────────────────────────────────
# SIDEBAR BRAND BLOCK
# ────────────────────────────────────────────────────────────────
def render_sidebar_brand() -> str:
    return """
    <div class="sidebar-brand">
        <div class="sidebar-icon">🧠</div>
        <div>
            <div class="sidebar-brand-text">Sahay AI</div>
            <div class="sidebar-brand-sub">Healthcare Platform</div>
        </div>
    </div>
    """


# ────────────────────────────────────────────────────────────────
# METRIC CARD
# ────────────────────────────────────────────────────────────────
_ACCENT_MAP = {
    "cyan":    ("linear-gradient(90deg,#06b6d4,#22d3ee)", "rgba(6,182,212,0.08)",    "mv-cyan"),
    "blue":    ("linear-gradient(90deg,#3b82f6,#60a5fa)", "rgba(59,130,246,0.08)",   "mv-blue"),
    "emerald": ("linear-gradient(90deg,#10b981,#34d399)", "rgba(16,185,129,0.08)",   "mv-emerald"),
    "violet":  ("linear-gradient(90deg,#8b5cf6,#a78bfa)", "rgba(139,92,246,0.08)",   "mv-violet"),
}

def render_metric_card(
    icon: str,
    label: str,
    value,
    color: str = "cyan",
    delta: str = "",
    delay: float = 0.0,
) -> str:
    accent, glow, cls = _ACCENT_MAP.get(color, _ACCENT_MAP["cyan"])
    delta_html = f"<div class='metric-delta'>{delta}</div>" if delta else ""
    return f"""
    <div class="metric-card"
         style="--card-accent:{accent};--card-glow:{glow};animation-delay:{delay}s">
        <span class="metric-icon">{icon}</span>
        <div class="metric-label">{label}</div>
        <div class="metric-value {cls}">{value}</div>
        {delta_html}
    </div>
    """


# ────────────────────────────────────────────────────────────────
# SECTION HEADER
# ────────────────────────────────────────────────────────────────
def render_section_header(icon: str, title: str, subtitle: str = "") -> str:
    sub = f"<div class='section-hdr-sub'>{subtitle}</div>" if subtitle else ""
    return f"""
    <div class="section-hdr">
        <div class="section-hdr-icon">{icon}</div>
        <div>
            <div class="section-hdr-title">{title}</div>
            {sub}
        </div>
    </div>
    """


# ────────────────────────────────────────────────────────────────
# INSIGHT CARD
# ────────────────────────────────────────────────────────────────
_INSIGHT_RULES = [
    (["⚠️", "late"],    "⚠️",  "#f59e0b"),
    (["✅", "healthy"], "✅",  "#10b981"),
    (["💊", "medicine"],"💊", "#8b5cf6"),
    (["🌙", "night"],   "🌙",  "#6366f1"),
    (["today"],         "📅",  "#06b6d4"),
    (["taken"],         "📊",  "#3b82f6"),
]

def render_insight_card(text: str, delay: float = 0.0) -> str:
    icon, color = "💡", "#06b6d4"
    lower = text.lower()
    for keywords, ic, cl in _INSIGHT_RULES:
        if any(k in text or k in lower for k in keywords):
            icon, color = ic, cl
            break
    clean = text
    for emoji in ("⚠️ ", "✅ ", "💊 ", "🌙 "):
        clean = clean.replace(emoji, "")
    return f"""
    <div class="insight-card" style="--ic:{color};animation-delay:{delay}s">
        <span class="insight-icon">{icon}</span>
        <div class="insight-text">{clean}</div>
    </div>
    """


# ────────────────────────────────────────────────────────────────
# PENDING MEDICINE ROW
# ────────────────────────────────────────────────────────────────
def render_pending_item(med: str, time: str, idx: int = 0) -> str:
    return f"""
    <div class="pending-item" style="animation-delay:{idx * 0.08}s">
        <div>
            <div class="pending-lbl">Medicine</div>
            <div class="pending-med">💊 {med.title()}</div>
        </div>
        <span class="pending-badge">⏰ {time}</span>
    </div>
    """


# ────────────────────────────────────────────────────────────────
# ADHERENCE PROGRESS BAR
# ────────────────────────────────────────────────────────────────
def render_adherence_bar(pct: int) -> str:
    color = "#10b981" if pct >= 80 else "#f59e0b" if pct >= 40 else "#f43f5e"
    return f"""
    <div class="adh-track">
        <div class="adh-fill" style="width:{pct}%;background:linear-gradient(90deg,{color},{color}88);"></div>
    </div>
    <div style="font-size:0.74rem;color:#64748b;margin-top:4px;text-align:right;">{pct}% adherence today</div>
    """


# ────────────────────────────────────────────────────────────────
# EMPTY STATE
# ────────────────────────────────────────────────────────────────
def render_empty_state(icon: str, title: str, subtitle: str) -> str:
    return f"""
    <div class="empty-state">
        <span class="empty-icon">{icon}</span>
        <div class="empty-title">{title}</div>
        <div class="empty-sub">{subtitle}</div>
    </div>
    """


# ────────────────────────────────────────────────────────────────
# GLASS WRAPPER (open / close helpers)
# ────────────────────────────────────────────────────────────────
GLASS_OPEN  = "<div class='glass-card'>"
GLASS_CLOSE = "</div>"


# ────────────────────────────────────────────────────────────────
# FOOTER
# ────────────────────────────────────────────────────────────────
def render_footer() -> str:
    year = datetime.now().year
    return f"""
    <div class="sahay-footer">
        <b>🧠 Sahay AI</b> &nbsp;·&nbsp; Intelligent Healthcare Platform
        &nbsp;·&nbsp; © {year} &nbsp;·&nbsp; All data processed locally
    </div>
    """
