from collections import Counter


class InsightEngine:
    def generate(self, tracker):
        insights = []

        # 📊 Analyze logs
        logs = tracker.logs

        if not logs:
            return ["No medicine data available yet."]

        # 🔥 Late medicine patterns
        late_count = 0

        for log in logs:
            scheduled = log.get("scheduled_time")
            taken = log.get("taken_time")

            if scheduled and taken:
                try:
                    sh, sm = map(int, scheduled.split(":"))
                    th, tm = map(int, taken.split(":"))

                    scheduled_minutes = sh * 60 + sm
                    taken_minutes = th * 60 + tm

                    if taken_minutes - scheduled_minutes > 30:
                        late_count += 1

                except:
                    pass

        if late_count >= 3:
            insights.append(
                "⚠️ You often take medicines late."
            )

        # 🔥 Medicine frequency
        meds = [log["medicine"] for log in logs]

        common = Counter(meds).most_common(1)

        if common:
            insights.append(
                f"💊 Most used medicine: {common[0][0]}"
            )

        # 🔥 Night medicine pattern
        night_missed = 0

        pending = tracker.get_pending_medicines()

        if "21:" in pending or "22:" in pending:
            night_missed += 1

        if night_missed:
            insights.append(
                "🌙 Night medicines are often pending."
            )

        if not insights:
            insights.append(
                "✅ Medicine routine looks healthy."
            )

        return insights