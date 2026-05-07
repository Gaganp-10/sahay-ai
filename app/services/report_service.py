from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet


class ReportService:
    def generate(
        self,
        tracker,
        insights,
        filename="health_report.pdf"
    ):
        doc = SimpleDocTemplate(filename)

        styles = getSampleStyleSheet()

        elements = []

        # 🧠 Title
        elements.append(
            Paragraph(
                "Sahay AI Healthcare Report",
                styles["Title"]
            )
        )

        elements.append(Spacer(1, 20))

        # 💊 Medicines
        elements.append(
            Paragraph(
                "Medicine Logs",
                styles["Heading2"]
            )
        )

        for log in tracker.logs:
            text = (
                f"{log['medicine']} "
                f"({log['scheduled_time']}) "
                f"taken at {log['taken_time']}"
            )

            elements.append(
                Paragraph(text, styles["BodyText"])
            )

        elements.append(Spacer(1, 20))

        # 🧠 Insights
        elements.append(
            Paragraph(
                "AI Health Insights",
                styles["Heading2"]
            )
        )

        for insight in insights:
            elements.append(
                Paragraph(insight, styles["BodyText"])
            )

        # 📄 Build PDF
        doc.build(elements)

        return filename