"""
Sahay AI — Premium CSS Design System v2.0
Glassmorphism dark healthcare dashboard styles.
"""

GLOBAL_CSS = """
<style>

/* ── Google Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* ── Design Tokens ── */
:root {
    --bg-primary:      #020617;
    --bg-secondary:    #0a1628;
    --glass-bg:        rgba(255,255,255,0.04);
    --glass-border:    rgba(255,255,255,0.08);
    --glass-hover:     rgba(255,255,255,0.07);
    --accent-cyan:     #06b6d4;
    --accent-blue:     #3b82f6;
    --accent-violet:   #8b5cf6;
    --accent-emerald:  #10b981;
    --accent-amber:    #f59e0b;
    --text-primary:    #f1f5f9;
    --text-secondary:  #94a3b8;
    --text-muted:      #475569;
    --radius-sm:       12px;
    --radius-md:       20px;
    --radius-lg:       28px;
    --shadow-card:     0 8px 32px rgba(0,0,0,0.4);
    --glow-cyan:       0 0 40px rgba(6,182,212,0.18);
    --glow-blue:       0 0 40px rgba(59,130,246,0.18);
}

/* ── Base ── */
html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    color: var(--text-primary) !important;
}

/* ── App Background ── */
.stApp {
    background: linear-gradient(135deg, #020617 0%, #0a1628 45%, #0f172a 75%, #080c1a 100%) !important;
    background-attachment: fixed !important;
}

/* ── Subtle grid overlay ── */
.stApp::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
        linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
    z-index: 0;
}

/* ── Layout ── */
.block-container {
    padding: 0 2rem 4rem 2rem !important;
    max-width: 1440px !important;
}

/* ── Hide Streamlit chrome ── */
#MainMenu, footer, header { visibility: hidden !important; }
.stDeployButton { display: none !important; }

/* ── Custom scrollbar ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.3); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent-cyan); }

/* ================================================================
   STICKY NAVBAR
================================================================ */
.sahay-navbar {
    position: sticky;
    top: 0;
    z-index: 999;
    background: rgba(2,6,23,0.82);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid rgba(6,182,212,0.10);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: -1rem -2rem 2.5rem -2rem;
    animation: fadeInDown 0.5s ease;
}
.navbar-brand {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 1.55rem;
    background: linear-gradient(135deg, #06b6d4 0%, #818cf8 55%, #f472b6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
}
.navbar-sub {
    font-size: 0.76rem;
    color: var(--text-muted);
    margin-top: 1px;
}
.navbar-status {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.22);
    border-radius: 50px;
    padding: 0.35rem 1rem;
    font-size: 0.78rem;
    color: #34d399;
    font-weight: 600;
}
.status-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
}

/* ================================================================
   SIDEBAR
================================================================ */
section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #080e1d 0%, #0a1628 100%) !important;
    border-right: 1px solid rgba(6,182,212,0.10) !important;
    min-width: 255px !important;
}
section[data-testid="stSidebar"] .block-container {
    padding: 1.5rem 1rem !important;
}
.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0.8rem 0.8rem 1.5rem 0.8rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.sidebar-icon {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 0 20px rgba(6,182,212,0.35);
    flex-shrink: 0;
}
.sidebar-brand-text {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
    background: linear-gradient(135deg, #06b6d4, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.sidebar-brand-sub {
    font-size: 0.68rem;
    color: var(--text-muted);
    -webkit-text-fill-color: var(--text-muted);
    font-weight: 400;
}
.sidebar-section-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 0 0.8rem;
    margin-bottom: 0.5rem;
}
/* Radio nav items */
div[data-testid="stSidebar"] .stRadio > label {
    color: var(--text-muted) !important;
    font-size: 0.72rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 6px;
}
div[data-testid="stSidebar"] .stRadio > div { gap: 3px !important; }
div[data-testid="stSidebar"] .stRadio label {
    background: transparent !important;
    border: 1px solid transparent !important;
    border-radius: var(--radius-sm) !important;
    padding: 0.7rem 1rem !important;
    color: var(--text-secondary) !important;
    font-size: 0.93rem !important;
    font-weight: 400 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    transition: all 0.2s ease !important;
    cursor: pointer;
}
div[data-testid="stSidebar"] .stRadio label:hover {
    background: rgba(6,182,212,0.08) !important;
    border-color: rgba(6,182,212,0.18) !important;
    color: var(--accent-cyan) !important;
    padding-left: 1.25rem !important;
}

/* ================================================================
   GLASS CARD
================================================================ */
.glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 2rem;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: var(--shadow-card);
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}
.glass-card:hover {
    border-color: rgba(6,182,212,0.16);
    box-shadow: var(--shadow-card), var(--glow-cyan);
}

/* ================================================================
   METRIC CARDS
================================================================ */
.metric-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 1.7rem 1.5rem 1.4rem 1.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    cursor: default;
    animation: fadeInUp 0.55s ease both;
}
.metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--card-accent, linear-gradient(90deg,#06b6d4,#3b82f6));
    border-radius: var(--radius-md) var(--radius-md) 0 0;
}
.metric-card::after {
    content: '';
    position: absolute;
    bottom: -50px; right: -25px;
    width: 110px; height: 110px;
    background: var(--card-glow, rgba(6,182,212,0.07));
    border-radius: 50%;
    filter: blur(28px);
    pointer-events: none;
}
.metric-card:hover {
    transform: translateY(-7px) scale(1.015);
    border-color: rgba(6,182,212,0.28);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), var(--glow-cyan);
    background: rgba(255,255,255,0.07);
}
.metric-icon { font-size: 1.65rem; margin-bottom: 0.9rem; display: block; }
.metric-label {
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.11em;
    margin-bottom: 0.45rem;
}
.metric-value {
    font-family: 'Outfit', sans-serif;
    font-size: 2.9rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
}
.mv-cyan    { color: #22d3ee; text-shadow: 0 0 28px rgba(34,211,238,0.45); }
.mv-blue    { color: #60a5fa; text-shadow: 0 0 28px rgba(96,165,250,0.45); }
.mv-emerald { color: #34d399; text-shadow: 0 0 28px rgba(52,211,153,0.45); }
.mv-violet  { color: #a78bfa; text-shadow: 0 0 28px rgba(167,139,250,0.45); }
.metric-delta { font-size: 0.76rem; color: var(--text-muted); }

/* ================================================================
   SECTION HEADER
================================================================ */
.section-hdr {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 2.5rem 0 1.25rem 0;
}
.section-hdr-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg,rgba(6,182,212,0.18),rgba(59,130,246,0.10));
    border: 1px solid rgba(6,182,212,0.2);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.05rem;
}
.section-hdr-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
}
.section-hdr-sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 1px; }

/* ================================================================
   INSIGHT CARDS
================================================================ */
.insight-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-left: 3px solid var(--ic, #06b6d4);
    border-radius: var(--radius-md);
    padding: 1.2rem 1.4rem;
    margin-bottom: 0.9rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: all 0.25s ease;
    animation: fadeInUp 0.5s ease both;
}
.insight-card:hover { transform: translateX(5px); background: rgba(255,255,255,0.06); }
.insight-icon { font-size: 1.35rem; min-width: 28px; }
.insight-text { font-size: 0.95rem; color: var(--text-primary); line-height: 1.65; }

/* ================================================================
   PENDING ITEMS
================================================================ */
.pending-item {
    background: linear-gradient(135deg,rgba(245,158,11,0.07),rgba(251,191,36,0.03));
    border: 1px solid rgba(245,158,11,0.18);
    border-radius: var(--radius-sm);
    padding: 1rem 1.2rem;
    margin-bottom: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.25s ease;
    animation: fadeInUp 0.45s ease both;
}
.pending-item:hover {
    border-color: rgba(245,158,11,0.38);
    background: linear-gradient(135deg,rgba(245,158,11,0.11),rgba(251,191,36,0.06));
}
.pending-med { font-weight: 600; font-size: 0.94rem; color: #fbbf24; }
.pending-lbl { font-size: 0.68rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 2px; }
.pending-badge {
    background: rgba(245,158,11,0.14);
    border: 1px solid rgba(245,158,11,0.28);
    border-radius: 50px;
    padding: 0.2rem 0.75rem;
    font-size: 0.76rem;
    font-weight: 700;
    color: #f59e0b;
    font-family: 'JetBrains Mono', monospace;
}

/* ================================================================
   ADHERENCE BAR
================================================================ */
.adh-track {
    height: 7px;
    background: rgba(255,255,255,0.07);
    border-radius: 10px;
    overflow: hidden;
    margin-top: 0.6rem;
}
.adh-fill {
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(90deg,#06b6d4,#3b82f6,#8b5cf6);
    box-shadow: 0 0 10px rgba(6,182,212,0.5);
    transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
}

/* ================================================================
   EMPTY STATE
================================================================ */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-muted);
}
.empty-icon { font-size: 3.5rem; opacity: 0.4; display: block; margin-bottom: 1rem; }
.empty-title { font-family:'Outfit',sans-serif; font-size:1.2rem; font-weight:600; color:var(--text-secondary); margin-bottom:0.5rem; }
.empty-sub { font-size:0.85rem; color:var(--text-muted); }

/* ================================================================
   DATAFRAME
================================================================ */
.stDataFrame { border-radius: var(--radius-md) !important; overflow: hidden !important; }

/* ================================================================
   STREAMLIT WIDGET OVERRIDES
================================================================ */
.stAlert { border-radius: var(--radius-md) !important; }
.stButton > button {
    background: linear-gradient(135deg,#06b6d4,#3b82f6) !important;
    color: #fff !important;
    border: none !important;
    border-radius: var(--radius-sm) !important;
    font-weight: 600 !important;
    padding: 0.55rem 1.4rem !important;
    transition: all 0.25s ease !important;
}
.stButton > button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(6,182,212,0.3) !important;
}

/* ================================================================
   FOOTER
================================================================ */
.sahay-footer {
    text-align: center;
    padding: 2rem;
    margin-top: 3rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    color: var(--text-muted);
    font-size: 0.78rem;
}
.sahay-footer b {
    background: linear-gradient(135deg,#06b6d4,#8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* ================================================================
   ANIMATIONS
================================================================ */
@keyframes fadeInUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0);    }
}
@keyframes fadeInDown {
    from { opacity:0; transform:translateY(-12px); }
    to   { opacity:1; transform:translateY(0);     }
}
@keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1);   }
    50%      { opacity:0.4; transform:scale(1.4); }
}

</style>
"""
