"""
Sahay AI — Chatbot Page

Full conversational AI page rendered inside the existing dashboard.
Uses st.chat_message + st.write_stream for reliable streaming.
"""

import streamlit as st

from ai.chat_service import ChatService
from ui.chat_ui import (
    render_chat_css,
    render_chat_header,
    render_context_bar,
    render_empty_chat,
)

# ── Session-state keys ───────────────────────────────────────────
_SVC_KEY  = "sahay_chat_service"
_HIST_KEY = "sahay_chat_history"   # list of {role, content}


def _init_session() -> ChatService:
    if _SVC_KEY not in st.session_state:
        st.session_state[_SVC_KEY] = ChatService()
    if _HIST_KEY not in st.session_state:
        st.session_state[_HIST_KEY] = []
    return st.session_state[_SVC_KEY]


def render(tracker=None) -> None:
    """Main entry point called from dashboard.py."""

    # ── Inject chat CSS ─────────────────────────────────────────
    st.markdown(render_chat_css(), unsafe_allow_html=True)

    # ── Init session ────────────────────────────────────────────
    service = _init_session()

    # ── Header row with Clear button ────────────────────────────
    hdr_col, btn_col = st.columns([7, 2])
    with hdr_col:
        st.markdown(render_chat_header(service.model_name), unsafe_allow_html=True)
    with btn_col:
        st.markdown("<div style='margin-top:1.4rem'></div>", unsafe_allow_html=True)
        if st.button("🗑️ Clear Chat", key="clear_chat_btn", use_container_width=True):
            service.clear()
            st.session_state[_HIST_KEY] = []
            st.rerun()

    # ── Live medicine context bar ────────────────────────────────
    if tracker:
        pending_raw = tracker.get_pending_medicines()
        st.markdown(render_context_bar(pending_raw), unsafe_allow_html=True)
    else:
        st.markdown(render_context_bar(""), unsafe_allow_html=True)

    # ── Render history or empty state ────────────────────────────
    history = st.session_state[_HIST_KEY]

    if not history:
        st.markdown(render_empty_chat(), unsafe_allow_html=True)
    else:
        for msg in history:
            role = msg["role"]
            content = msg["content"]
            avatar = "🧑" if role == "user" else "🤖"
            with st.chat_message(role, avatar=avatar):
                st.markdown(content)

    # ── Chat input ───────────────────────────────────────────────
    user_input = st.chat_input(
        "Ask Sahay AI about your medicines, health, or schedule…",
        key="sahay_chat_input",
    )

    if user_input and user_input.strip():
        user_text = user_input.strip()

        # Add + show user message
        st.session_state[_HIST_KEY].append({"role": "user", "content": user_text})
        with st.chat_message("user", avatar="🧑"):
            st.markdown(user_text)

        # Stream AI response via st.write_stream
        with st.chat_message("assistant", avatar="🤖"):
            try:
                response = st.write_stream(
                    service.stream_response(user_text, tracker)
                )
            except Exception as e:
                err_type = type(e).__name__
                if "RateLimitError" in err_type or "rate_limit" in str(e).lower():
                    response = (
                        "⚠️ I'm receiving too many requests right now. "
                        "Please wait a moment and try again."
                    )
                elif "AuthenticationError" in err_type or "api_key" in str(e).lower():
                    response = (
                        "⚠️ OpenAI API key issue detected. "
                        "Please check your `.env` file for a valid `OPENAI_API_KEY`."
                    )
                else:
                    response = (
                        f"⚠️ Something went wrong ({err_type}). "
                        "Please try again or check your connection."
                    )
                st.markdown(response)

        # Persist the final assistant message
        st.session_state[_HIST_KEY].append({"role": "assistant", "content": response})
        st.rerun()
