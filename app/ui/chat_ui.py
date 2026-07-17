"""
Sahay AI — Chat UI Components

Reusable HTML renderers for the glassmorphism chatbot interface.
Matches the existing premium design system in ui/styles.py.
"""

from datetime import datetime


# ────────────────────────────────────────────────────────────────
# CHAT-SPECIFIC CSS (injected once per page load)
# ────────────────────────────────────────────────────────────────
CHAT_CSS = """
<style>

/* ── Chat page layout ── */
.chat-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 860px;
    margin: 0 auto;
    padding-bottom: 6rem;        /* room for sticky input */
}

/* ── Chat header ── */
.chat-header {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 1.2rem 1.6rem;
    margin-bottom: 1.5rem;
    animation: fadeInUp 0.4s ease;
}
.chat-avatar {
    width: 50px; height: 50px;
    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 0 24px rgba(6,182,212,0.35);
    flex-shrink: 0;
}
.chat-header-info { flex: 1; }
.chat-header-name {
    font-family: 'Outfit', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: #f1f5f9;
}
.chat-header-sub {
    font-size: 0.76rem;
    color: #475569;
    margin-top: 1px;
}
.chat-header-badge {
    display: flex; align-items: center; gap: 7px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.22);
    border-radius: 50px;
    padding: 0.3rem 0.9rem;
    font-size: 0.75rem;
    color: #34d399;
    font-weight: 600;
}
.chat-badge-dot {
    width: 7px; height: 7px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
}

/* ── Context bar ── */
.chat-context-bar {
    background: linear-gradient(135deg, rgba(6,182,212,0.06), rgba(59,130,246,0.04));
    border: 1px solid rgba(6,182,212,0.14);
    border-radius: 14px;
    padding: 0.85rem 1.2rem;
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeInUp 0.5s ease;
}
.context-bar-label { color: #22d3ee; font-weight: 600; }

/* ── Message bubbles ── */
.msg-row {
    display: flex;
    margin-bottom: 1.1rem;
    animation: fadeInUp 0.35s ease;
}
.msg-row.user  { justify-content: flex-end; }
.msg-row.assistant { justify-content: flex-start; }

/* User bubble */
.bubble-user {
    max-width: 72%;
    background: linear-gradient(135deg, #0e7490, #1d4ed8);
    border: 1px solid rgba(6,182,212,0.25);
    border-radius: 20px 20px 4px 20px;
    padding: 0.9rem 1.2rem;
    color: #f0f9ff;
    font-size: 0.93rem;
    line-height: 1.65;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

/* Assistant bubble */
.bubble-ai {
    max-width: 78%;
    display: flex;
    gap: 10px;
    align-items: flex-start;
}
.bubble-ai-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 2px;
    box-shadow: 0 0 12px rgba(6,182,212,0.2);
}
.bubble-ai-content {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-left: 3px solid #06b6d4;
    border-radius: 4px 20px 20px 20px;
    padding: 0.9rem 1.2rem;
    color: #e2e8f0;
    font-size: 0.93rem;
    line-height: 1.7;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
}

/* ── Timestamps ── */
.msg-time {
    font-size: 0.67rem;
    color: #334155;
    margin-top: 4px;
    text-align: right;
}
.msg-row.assistant .msg-time { text-align: left; padding-left: 44px; }

/* ── Typing indicator ── */
.typing-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 1rem;
    animation: fadeInUp 0.3s ease;
}
.typing-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}
.typing-bubble {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-left: 3px solid #06b6d4;
    border-radius: 4px 20px 20px 20px;
    padding: 0.9rem 1.2rem;
    display: flex;
    align-items: center;
    gap: 5px;
}
.typing-dot {
    width: 7px; height: 7px;
    background: #06b6d4;
    border-radius: 50%;
    animation: typing-bounce 1.2s infinite ease-in-out;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

/* ── Empty state ── */
.chat-empty {
    text-align: center;
    padding: 3.5rem 2rem;
    color: #475569;
}
.chat-empty-icon { font-size: 3rem; opacity: 0.35; margin-bottom: 1rem; display: block; }
.chat-empty-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.5rem;
}
.chat-empty-sub { font-size: 0.83rem; color: #334155; line-height: 1.7; }

/* ── Suggestion chips ── */
.chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 1.2rem;
}
.chip {
    background: rgba(6,182,212,0.08);
    border: 1px solid rgba(6,182,212,0.2);
    border-radius: 50px;
    padding: 0.4rem 1rem;
    font-size: 0.78rem;
    color: #22d3ee;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
}

/* ── Animations ── */
@keyframes typing-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%           { transform: translateY(-6px); opacity: 1; }
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(1.4); }
}

/* ── Override st.chat_input styling ── */
div[data-testid="stChatInput"] {
    background: rgba(10,22,40,0.95) !important;
    border-top: 1px solid rgba(6,182,212,0.12) !important;
    padding: 1rem 2rem !important;
}
div[data-testid="stChatInput"] textarea {
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid rgba(6,182,212,0.2) !important;
    border-radius: 14px !important;
    color: #f1f5f9 !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 0.93rem !important;
}
div[data-testid="stChatInput"] textarea:focus {
    border-color: rgba(6,182,212,0.5) !important;
    box-shadow: 0 0 0 3px rgba(6,182,212,0.08) !important;
}

</style>
"""


# ────────────────────────────────────────────────────────────────
# Component renderers
# ────────────────────────────────────────────────────────────────

def render_chat_css() -> str:
    return CHAT_CSS


def render_chat_header(model: str = "gpt-4o-mini") -> str:
    return f"""
    <div class="chat-header">
        <div class="chat-avatar">🧠</div>
        <div class="chat-header-info">
            <div class="chat-header-name">Sahay AI Healthcare Assistant</div>
            <div class="chat-header-sub">
                Powered by {model} &nbsp;·&nbsp; Conversational memory enabled
            </div>
        </div>
        <div class="chat-header-badge">
            <span class="chat-badge-dot"></span>
            Online
        </div>
    </div>
    """


def render_context_bar(pending_raw: str) -> str:
    if pending_raw == "All medicines taken for today.":
        icon, text = "✅", "All medicines taken today — great adherence!"
        color = "#10b981"
    elif pending_raw.startswith("Pending doses:"):
        doses = pending_raw.replace("Pending doses:", "").strip()
        icon, text = "⏰", f"Pending: {doses}"
        color = "#f59e0b"
    else:
        icon, text = "💊", "No medicines scheduled yet"
        color = "#475569"

    return f"""
    <div class="chat-context-bar">
        <span style="font-size:1.1rem">{icon}</span>
        <span><span class="context-bar-label" style="color:{color}">Today's Status &nbsp;·&nbsp; </span>{text}</span>
    </div>
    """


def render_user_message(content: str, timestamp: str = "") -> str:
    ts = f"<div class='msg-time'>{timestamp}</div>" if timestamp else ""
    return f"""
    <div class="msg-row user">
        <div>
            <div class="bubble-user">{content}</div>
            {ts}
        </div>
    </div>
    """


def render_ai_message(content: str, timestamp: str = "") -> str:
    ts = f"<div class='msg-time'>{timestamp}</div>" if timestamp else ""
    # Convert newlines to <br> for HTML rendering
    html_content = content.replace("\n", "<br>")
    return f"""
    <div class="msg-row assistant">
        <div class="bubble-ai">
            <div class="bubble-ai-icon">🤖</div>
            <div>
                <div class="bubble-ai-content">{html_content}</div>
                {ts}
            </div>
        </div>
    </div>
    """


def render_typing_indicator() -> str:
    return """
    <div class="typing-row">
        <div class="typing-icon">🤖</div>
        <div class="typing-bubble">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    </div>
    """


def render_empty_chat() -> str:
    return """
    <div class="chat-empty">
        <span class="chat-empty-icon">💬</span>
        <div class="chat-empty-title">Start a Conversation</div>
        <div class="chat-empty-sub">
            Ask about your medicines, pending doses, health tips,<br>
            or anything related to your daily healthcare routine.
        </div>
        <div class="chip-row">
            <span class="chip">💊 What medicines are pending?</span>
            <span class="chip">📅 What did I take today?</span>
            <span class="chip">💡 Give me a health tip</span>
            <span class="chip">⏰ Am I on schedule?</span>
        </div>
    </div>
    """


def now_str() -> str:
    return datetime.now().strftime("%I:%M %p")
