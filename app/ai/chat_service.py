"""
Sahay AI — LangChain Chat Service

Wraps ChatOpenAI with a lightweight sliding-window conversation memory
and a dynamic healthcare system prompt. Exposes both streaming and
non-streaming response methods for use in the Streamlit chatbot page.
"""

import os
from typing import Generator, List, Tuple

from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

from ai.system_prompt import build_system_prompt

load_dotenv()

# ── Model config ──────────────────────────────────────────────
_MODEL       = "mistral-small-latest"
_TEMPERATURE = 0.4
_MAX_TOKENS  = 512
_MEMORY_K    = 10   # exchange pairs retained in sliding window


class _WindowMemory:
    """
    Lightweight sliding-window conversation memory.
    Stores the last k HumanMessage/AIMessage pairs without requiring
    any LangChain memory module (avoids version compatibility issues).
    """

    def __init__(self, k: int = _MEMORY_K):
        self._k = k
        self._messages: List = []

    def add_user(self, text: str) -> None:
        self._messages.append(HumanMessage(content=text))
        self._trim()

    def add_ai(self, text: str) -> None:
        self._messages.append(AIMessage(content=text))
        self._trim()

    def get_messages(self) -> List:
        return list(self._messages)

    def clear(self) -> None:
        self._messages.clear()

    def _trim(self) -> None:
        max_msgs = self._k * 2
        if len(self._messages) > max_msgs:
            self._messages = self._messages[-max_msgs:]


class ChatService:
    """
    Stateful LangChain chat service with per-session conversational memory.

    Typical usage (Streamlit):
        service = ChatService()
        for chunk in service.stream_response("Am I late on my medicines?", tracker):
            st.write(chunk)
    """

    def __init__(self):
        # Single Mistral LLM instance — streaming is controlled per-call
        self._llm = ChatMistralAI(
            model=_MODEL,
            temperature=_TEMPERATURE,
            max_tokens=_MAX_TOKENS,
            api_key=os.getenv("MISTRAL_API_KEY"),
        )
        self._mem = _WindowMemory(k=_MEMORY_K)
        self._history: List[Tuple[str, str]] = []

    # ────────────────────────────────────────────────────────────
    # Public API
    # ────────────────────────────────────────────────────────────

    def stream_response(
        self,
        user_input: str,
        tracker=None,
    ) -> Generator[str, None, None]:
        """
        Stream AI response tokens one by one.
        Saves both sides of the conversation to memory after completion.

        Args:
            user_input: The user's chat message.
            tracker:    MedicineTracker instance for live context (optional).

        Yields:
            Individual text chunks from the LLM stream.
        """
        messages = self._build_messages(user_input, tracker)

        full_response = ""
        for chunk in self._llm_stream.stream(messages):
            token = chunk.content
            full_response += token
            yield token

        # Persist to sliding-window memory + local history
        self._mem.add_user(user_input)
        self._mem.add_ai(full_response)
        self._history.append(("user", user_input))
        self._history.append(("assistant", full_response))

    def get_response(self, user_input: str, tracker=None) -> str:
        """Non-streaming response — useful for testing or fallback."""
        messages = self._build_messages(user_input, tracker)
        response = self._llm_plain.invoke(messages)
        content = response.content

        self._mem.add_user(user_input)
        self._mem.add_ai(content)
        self._history.append(("user", user_input))
        self._history.append(("assistant", content))
        return content

    def get_history(self) -> List[Tuple[str, str]]:
        """Return full chat history as list of (role, content) tuples."""
        return list(self._history)

    def clear(self) -> None:
        """Reset memory and history for a fresh conversation."""
        self._mem.clear()
        self._history.clear()

    @property
    def model_name(self) -> str:
        return _MODEL

    # ────────────────────────────────────────────────────────────
    # Private helpers
    # ────────────────────────────────────────────────────────────

    def _build_messages(self, user_input: str, tracker=None) -> List:
        """
        Assemble the full message list:
          [SystemMessage] + [past HumanMessage/AIMessage] + [new HumanMessage]
        """
        system_content = build_system_prompt(tracker)
        messages = [SystemMessage(content=system_content)]
        messages.extend(self._mem.get_messages())
        messages.append(HumanMessage(content=user_input))
        return messages
