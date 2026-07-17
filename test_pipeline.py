import sys
sys.path.insert(0, 'app')
import os, json, re
from dotenv import load_dotenv
load_dotenv()
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.1,
    max_tokens=512,
    api_key=os.getenv("OPENAI_API_KEY"),
)

try:
    resp = llm.invoke([HumanMessage(content="Say hello in one word")])
    print("LLM OK:", resp.content)
except Exception as e:
    print("LLM ERROR:", type(e).__name__, str(e)[:300])
