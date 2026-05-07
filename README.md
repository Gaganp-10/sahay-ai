# 🧠 Sahay AI — Intelligent Healthcare Assistant

Sahay AI is an AI-powered healthcare assistant designed to help elderly patients manage medicines, reminders, prescription understanding, and caregiver communication.

---

# 🚀 Features

## ✅ Medicine Management
- Add medicines
- Track doses
- Mark medicines as taken
- Detect missed medicines

## 🔔 Smart Reminder System
- Automated reminders
- Missed medicine alerts
- Caregiver notifications

## 🧠 AI Assistant
- Natural language understanding
- Emotion-aware responses
- Personalized interactions

## 📄 OCR Prescription Reading
- Reads medicine names from prescriptions
- OCR-powered medicine extraction

## 📊 Healthcare Dashboard
- Medicine logs
- Adherence tracking
- Analytics dashboard

## 👨‍⚕️ Caregiver Support
- SMS alerts using Twilio
- Missed medicine notifications

---

# 🛠️ Tech Stack

- Python
- Streamlit
- SQLite
- LangChain
- Mistral AI
- OCR (Tesseract)
- Twilio
- Pandas

---

# 📂 Project Structure

```text
app/
 ├── agents/
 ├── core/
 ├── db/
 ├── memory/
 ├── services/
 ├── utils/

main.py
requirements.txt
README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Gaganp-10/sahay-ai.git
cd sahay-ai
```

---

## Install Dependencies

```bash
uv sync
```

---

## Run Application

### Terminal Assistant

```bash
uv run main.py
```

### Dashboard

```bash
uv run streamlit run app/dashboard.py
```

---

# 🔐 Environment Variables

Create `.env` file:

```env
MISTRAL_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
CAREGIVER_PHONE=your_phone
```

---

# 📸 Screenshots

(Add screenshots here later)

---

# 🚀 Future Scope

- Voice assistant
- Mobile app
- PostgreSQL database
- FastAPI backend
- Authentication system
- Cloud deployment

---

# 👨‍💻 Author

Gagan

---

# 📜 License

MIT License