import streamlit as st
import pandas as pd
import sqlite3
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime

from core.system import system
from ui.styles import GLOBAL_CSS
from ui.components import (
    render_navbar,
    render_sidebar_brand,
    render_metric_card,
    render_section_header,
    render_insight_card,
    render_pending_item,
    render_adherence_bar,
    render_empty_state,
    render_footer,
    GLASS_OPEN,
    GLASS_CLOSE,
)
import views.chatbot_page as chatbot_page
import views.prescription_page as prescription_page

# ================================================================
# PAGE CONFIG
# ================================================================
st.set_page_config(
    page_title="Sahay AI — Healthcare Platform",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ================================================================
# INJECT CSS
# ================================================================
st.markdown(GLOBAL_CSS, unsafe_allow_html=True)

# ================================================================
# PLOTLY DARK THEME (shared across all charts)
# ================================================================
PLOTLY_LAYOUT = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Inter, sans-serif", color="#94a3b8", size=12),
    title_font=dict(family="Outfit, sans-serif", color="#f1f5f9", size=16),
    xaxis=dict(
        gridcolor="rgba(255,255,255,0.05)",
        zerolinecolor="rgba(255,255,255,0.06)",
        tickfont=dict(color="#64748b"),
        linecolor="rgba(255,255,255,0.06)",
    ),
    yaxis=dict(
        gridcolor="rgba(255,255,255,0.05)",
        zerolinecolor="rgba(255,255,255,0.06)",
        tickfont=dict(color="#64748b"),
        linecolor="rgba(255,255,255,0.06)",
    ),
    legend=dict(
        bgcolor="rgba(0,0,0,0)",
        bordercolor="rgba(255,255,255,0.08)",
        font=dict(color="#94a3b8"),
    ),
    margin=dict(l=16, r=16, t=48, b=16),
    hoverlabel=dict(
        bgcolor="#0f172a",
        bordercolor="#06b6d4",
        font=dict(family="Inter, sans-serif", color="#f1f5f9"),
    ),
)

CYAN_PALETTE  = ["#06b6d4", "#0891b2", "#22d3ee", "#67e8f9", "#a5f3fc"]
MULTI_PALETTE = ["#06b6d4", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"]

# ================================================================
# SIDEBAR
# ================================================================
with st.sidebar:
    st.markdown(render_sidebar_brand(), unsafe_allow_html=True)

    st.markdown("<div class='sidebar-section-label'>Navigation</div>", unsafe_allow_html=True)

    page = st.radio(
        "Go to",
        ["📊 Dashboard", "📄 Medicine Logs", "⏰ Pending Medicines", "🤖 AI Insights", "💬 AI Chatbot", "🔬 Prescription Scanner"],
        label_visibility="collapsed",
    )

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown(
        """
        <div style='padding:1rem;background:rgba(6,182,212,0.06);
                    border:1px solid rgba(6,182,212,0.12);border-radius:14px;
                    font-size:0.78rem;color:#475569;line-height:1.7;'>
            <div style='color:#22d3ee;font-weight:600;margin-bottom:6px;'>💡 Quick Tips</div>
            Try the <b style='color:#94a3b8'>AI Chatbot</b> to ask health questions in natural language.<br>
            Check <b style='color:#94a3b8'>AI Insights</b> daily for your adherence summary.
        </div>
        """,
        unsafe_allow_html=True,
    )

# ================================================================
# PAGE NAME (strip emoji prefix)
# ================================================================
page_display = page.split(" ", 1)[1] if " " in page else page

# ================================================================
# STICKY NAVBAR
# ================================================================
st.markdown(render_navbar(page_display), unsafe_allow_html=True)

# ================================================================
# DATABASE LOAD
# ================================================================
@st.cache_data(ttl=30)
def load_logs() -> pd.DataFrame:
    try:
        conn = sqlite3.connect("sahay.db")
        df = pd.read_sql_query("SELECT * FROM medicine_logs", conn)
        conn.close()
        return df
    except Exception:
        return pd.DataFrame(columns=["medicine", "scheduled_time", "taken_time", "date"])

logs = load_logs()

# ================================================================
# DASHBOARD PAGE
# ================================================================
if page == "📊 Dashboard":

    today = datetime.now().strftime("%Y-%m-%d")

    total_logs       = len(logs)
    unique_medicines = logs["medicine"].nunique() if not logs.empty else 0
    today_logs_count = len(logs[logs["date"] == today]) if not logs.empty else 0
    adherence        = min(today_logs_count * 20, 100)

    # ── Metric Cards ─────────────────────────────────────────────
    col1, col2, col3, col4 = st.columns(4, gap="medium")

    with col1:
        st.markdown(
            render_metric_card("📋", "Total Logs", total_logs, "cyan", "All-time records", 0.1),
            unsafe_allow_html=True,
        )
    with col2:
        st.markdown(
            render_metric_card("💊", "Medicines", unique_medicines, "blue", "Unique medicines tracked", 0.2),
            unsafe_allow_html=True,
        )
    with col3:
        st.markdown(
            render_metric_card("📅", "Today's Doses", today_logs_count, "emerald", f"On {today}", 0.3),
            unsafe_allow_html=True,
        )
    with col4:
        st.markdown(
            render_metric_card("🎯", "Adherence", f"{adherence}%", "violet", "Today's compliance rate", 0.4),
            unsafe_allow_html=True,
        )
        st.markdown(render_adherence_bar(adherence), unsafe_allow_html=True)

    # ── Charts ───────────────────────────────────────────────────
    if not logs.empty:

        st.markdown(
            render_section_header("📊", "Medicine Analytics", "Visual breakdown of your medication history"),
            unsafe_allow_html=True,
        )

        chart_col1, chart_col2 = st.columns(2, gap="medium")

        # Bar chart — frequency
        with chart_col1:
            st.markdown(GLASS_OPEN, unsafe_allow_html=True)

            med_counts = (
                logs["medicine"]
                .value_counts()
                .reset_index()
            )
            med_counts.columns = ["Medicine", "Count"]

            fig_bar = go.Figure(
                go.Bar(
                    x=med_counts["Medicine"].str.title(),
                    y=med_counts["Count"],
                    marker=dict(
                        color=CYAN_PALETTE[:len(med_counts)],
                        line=dict(color="rgba(0,0,0,0)", width=0),
                    ),
                    hovertemplate="<b>%{x}</b><br>Doses: %{y}<extra></extra>",
                )
            )
            fig_bar.update_layout(
                **PLOTLY_LAYOUT,
                title="Medicine Intake Frequency",
                showlegend=False,
                bargap=0.35,
            )
            st.plotly_chart(fig_bar, use_container_width=True)  # noqa
            st.markdown(GLASS_CLOSE, unsafe_allow_html=True)

        # Pie chart — distribution
        with chart_col2:
            st.markdown(GLASS_OPEN, unsafe_allow_html=True)

            fig_pie = go.Figure(
                go.Pie(
                    labels=med_counts["Medicine"].str.title(),
                    values=med_counts["Count"],
                    hole=0.55,
                    marker=dict(
                        colors=MULTI_PALETTE[:len(med_counts)],
                        line=dict(color="#020617", width=2),
                    ),
                    hovertemplate="<b>%{label}</b><br>%{value} doses (%{percent})<extra></extra>",
                )
            )
            fig_pie.update_layout(
                **PLOTLY_LAYOUT,
                title="Medicine Distribution",
                showlegend=True,
                annotations=[dict(
                    text=f"<b>{total_logs}</b><br><span style='font-size:10px'>total</span>",
                    x=0.5, y=0.5, showarrow=False,
                    font=dict(size=18, color="#f1f5f9", family="Outfit, sans-serif"),
                )],
            )
            st.plotly_chart(fig_pie, use_container_width=True)
            st.markdown(GLASS_CLOSE, unsafe_allow_html=True)

        # Timeline chart
        st.markdown(
            render_section_header("📈", "Medication Timeline", "Daily dose pattern over time"),
            unsafe_allow_html=True,
        )

        st.markdown(GLASS_OPEN, unsafe_allow_html=True)

        daily = (
            logs.groupby("date")
            .size()
            .reset_index(name="Doses")
        )

        fig_line = go.Figure(
            go.Scatter(
                x=daily["date"],
                y=daily["Doses"],
                mode="lines+markers",
                line=dict(color="#06b6d4", width=2.5),
                marker=dict(size=7, color="#22d3ee", line=dict(color="#020617", width=1.5)),
                fill="tozeroy",
                fillcolor="rgba(6,182,212,0.07)",
                hovertemplate="<b>%{x}</b><br>Doses taken: %{y}<extra></extra>",
            )
        )
        fig_line.update_layout(
            **PLOTLY_LAYOUT,
            title="Daily Dose Count Over Time",
            showlegend=False,
        )
        st.plotly_chart(fig_line, use_container_width=True)
        st.markdown(GLASS_CLOSE, unsafe_allow_html=True)

    else:
        st.markdown(
            render_empty_state(
                "📋",
                "No Data Yet",
                "Start logging medicines via the AI assistant to see analytics here.",
            ),
            unsafe_allow_html=True,
        )

# ================================================================
# MEDICINE LOGS PAGE
# ================================================================
elif page == "📄 Medicine Logs":

    st.markdown(
        render_section_header("📄", "Medicine Logs", "Complete history of all recorded doses"),
        unsafe_allow_html=True,
    )

    if logs.empty:
        st.markdown(
            render_empty_state("📭", "No Logs Found", "No medicine logs have been recorded yet."),
            unsafe_allow_html=True,
        )
    else:
        st.markdown(GLASS_OPEN, unsafe_allow_html=True)

        display_logs = logs.copy()
        if "medicine" in display_logs.columns:
            display_logs["medicine"] = display_logs["medicine"].str.title()

        st.dataframe(
            display_logs,
            use_container_width=True,
            hide_index=True,
            column_config={
                "medicine":       st.column_config.TextColumn("💊 Medicine"),
                "scheduled_time": st.column_config.TextColumn("🕐 Scheduled"),
                "taken_time":     st.column_config.TextColumn("✅ Taken At"),
                "date":           st.column_config.TextColumn("📅 Date"),
            },
        )

        st.markdown(GLASS_CLOSE, unsafe_allow_html=True)

        # Summary cards
        st.markdown(
            render_section_header("📊", "Log Summary", "Quick statistics from your records"),
            unsafe_allow_html=True,
        )

        c1, c2, c3 = st.columns(3, gap="medium")
        with c1:
            st.markdown(
                render_metric_card("📆", "Total Records", len(logs), "cyan", delay=0.1),
                unsafe_allow_html=True,
            )
        with c2:
            st.markdown(
                render_metric_card("💊", "Unique Medicines", logs["medicine"].nunique(), "blue", delay=0.2),
                unsafe_allow_html=True,
            )
        with c3:
            days = logs["date"].nunique() if "date" in logs.columns else 0
            st.markdown(
                render_metric_card("📅", "Days Tracked", days, "emerald", delay=0.3),
                unsafe_allow_html=True,
            )

# ================================================================
# PENDING MEDICINES PAGE
# ================================================================
elif page == "⏰ Pending Medicines":

    st.markdown(
        render_section_header("⏰", "Pending Medicines", "Doses not yet taken for today"),
        unsafe_allow_html=True,
    )

    pending_raw = system.tracker.get_pending_medicines()

    if pending_raw == "All medicines taken for today.":
        st.markdown(
            f"""
            <div class='glass-card' style='text-align:center;padding:3rem;border-color:rgba(16,185,129,0.2);'>
                <div style='font-size:3rem;margin-bottom:1rem;'>🎉</div>
                <div style='font-family:Outfit,sans-serif;font-size:1.4rem;font-weight:700;
                            color:#34d399;margin-bottom:0.5rem;'>All Done!</div>
                <div style='color:#64748b;font-size:0.9rem;'>
                    All medicines have been taken for today. Great job! 💪
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    elif pending_raw.startswith("Pending doses:"):
        items_str = pending_raw.replace("Pending doses:", "").strip()
        items = [item.strip() for item in items_str.split(",") if item.strip()]

        st.markdown(
            f"""
            <div style='margin-bottom:1.5rem;'>
                <span style='background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.25);
                             border-radius:50px;padding:0.35rem 1rem;font-size:0.8rem;
                             font-weight:600;color:#fbbf24;'>
                    ⚠️ {len(items)} dose{"s" if len(items) != 1 else ""} pending
                </span>
            </div>
            """,
            unsafe_allow_html=True,
        )

        for idx, item in enumerate(items):
            # Parse "medicine_name (HH:MM)"
            if "(" in item and ")" in item:
                med  = item[:item.index("(")].strip()
                time = item[item.index("(")+1:item.index(")")].strip()
            else:
                med, time = item, "—"

            st.markdown(render_pending_item(med, time, idx), unsafe_allow_html=True)

    else:
        st.info(pending_raw)

# ================================================================
# AI INSIGHTS PAGE
# ================================================================
elif page == "🤖 AI Insights":

    st.markdown(
        render_section_header("🤖", "AI Health Insights", "Intelligent analysis of your medication patterns"),
        unsafe_allow_html=True,
    )

    insights = []

    if logs.empty:
        insights.append("No medicine history available yet. Start tracking to get insights.")
    else:
        insights.append(f"You have taken {len(logs)} dose(s) total across your tracking history.")

        most_common = logs["medicine"].value_counts().idxmax()
        insights.append(f"💊 Most frequently taken medicine: {most_common.title()}")

        today = datetime.now().strftime("%Y-%m-%d")
        today_count = len(logs[logs["date"] == today])
        insights.append(f"Today's dose count: {today_count} medicine(s) logged.")

        days_active = logs["date"].nunique()
        insights.append(f"You have been actively tracking for {days_active} day(s).")

        # Late dose detection
        late_count = 0
        for _, row in logs.iterrows():
            try:
                sh, sm = map(int, str(row["scheduled_time"]).split(":"))
                th, tm = map(int, str(row["taken_time"]).split(":"))
                if (th * 60 + tm) - (sh * 60 + sm) > 30:
                    late_count += 1
            except Exception:
                pass

        if late_count >= 3:
            insights.append("⚠️ You often take medicines late — try setting phone reminders.")
        elif late_count == 0 and len(logs) > 0:
            insights.append("✅ Excellent timing! You are consistently taking medicines on schedule.")

        adherence_today = min(today_count * 20, 100)
        if adherence_today == 100:
            insights.append("✅ Medicine routine looks healthy — perfect adherence today!")
        elif adherence_today >= 60:
            insights.append("Good adherence today. Keep it up to reach 100%!")

    for i, insight in enumerate(insights):
        st.markdown(render_insight_card(insight, delay=i * 0.1), unsafe_allow_html=True)

    # Insights summary metrics
    if not logs.empty:
        st.markdown(
            render_section_header("📈", "Health Metrics", "Key numbers from your history"),
            unsafe_allow_html=True,
        )
        m1, m2, m3 = st.columns(3, gap="medium")
        with m1:
            st.markdown(
                render_metric_card("🔥", "Streak Days", logs["date"].nunique(), "cyan", delay=0.1),
                unsafe_allow_html=True,
            )
        with m2:
            late_pct = round((late_count / len(logs)) * 100) if len(logs) > 0 else 0
            st.markdown(
                render_metric_card("⏱️", "Late Doses %", f"{late_pct}%", "violet", delay=0.2),
                unsafe_allow_html=True,
            )
        with m3:
            avg_per_day = round(len(logs) / max(logs["date"].nunique(), 1), 1)
            st.markdown(
                render_metric_card("📊", "Avg / Day", avg_per_day, "blue", delay=0.3),
                unsafe_allow_html=True,
            )

# ================================================================
# AI CHATBOT PAGE
# ================================================================
elif page == "💬 AI Chatbot":
    chatbot_page.render(tracker=system.tracker)

# ================================================================
# PRESCRIPTION SCANNER PAGE
# ================================================================
elif page == "🔬 Prescription Scanner":
    prescription_page.render(tracker=system.tracker)

# ================================================================
# FOOTER
# ================================================================
st.markdown(render_footer(), unsafe_allow_html=True)