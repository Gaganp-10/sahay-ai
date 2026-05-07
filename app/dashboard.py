import streamlit as st
import sqlite3
import pandas as pd
import plotly.express as px
from app.core.system import system
from app.services.insight_engine import InsightEngine

st.set_page_config(
    page_title="Sahay AI Dashboard",
    layout="wide"
)

st.title("🧠 Sahay AI Healthcare Dashboard")

# 🧠 AI Insights
st.subheader("🧠 AI Health Insights")

engine = InsightEngine()

insights = engine.generate(system.tracker)

for insight in insights:
    st.info(insight)

# 🔗 Connect DB
conn = sqlite3.connect("sahay.db")

# 📄 Load logs
logs = pd.read_sql_query(
    "SELECT * FROM medicine_logs",
    conn
)

meds = pd.read_sql_query(
    "SELECT * FROM medicines",
    conn
)

# ✅ SUMMARY CARDS
col1, col2, col3 = st.columns(3)

with col1:
    st.metric("💊 Medicines", len(meds))

with col2:
    st.metric("✅ Taken Logs", len(logs))

with col3:
    adherence = 0

    if len(meds) > 0:
        adherence = round((len(logs) / len(meds)) * 100, 1)

    st.metric("📊 Adherence %", adherence)

st.divider()

# 📋 MEDICINES TABLE
st.subheader("💊 Scheduled Medicines")

st.dataframe(meds, use_container_width=True)

# 📋 LOGS TABLE
st.subheader("📝 Medicine Logs")

st.dataframe(logs, use_container_width=True)

# 📊 CHART — Medicine Frequency
st.subheader("📈 Medicine Frequency")

if not logs.empty:
    freq = logs["medicine"].value_counts().reset_index()

    freq.columns = ["Medicine", "Count"]

    fig = px.bar(
        freq,
        x="Medicine",
        y="Count",
        title="Medicine Usage"
    )

    st.plotly_chart(fig, use_container_width=True)

# 📊 DAILY ACTIVITY
st.subheader("📅 Daily Activity")

if not logs.empty:
    daily = logs.groupby("date").size().reset_index(name="count")

    fig2 = px.line(
        daily,
        x="date",
        y="count",
        title="Daily Medicine Activity"
    )

    st.plotly_chart(fig2, use_container_width=True)

# 🔄 AUTO REFRESH
st.caption("Dashboard auto-refreshes on rerun.")