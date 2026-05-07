import sqlite3


def init_db():
    conn = sqlite3.connect("sahay.db")

    cursor = conn.cursor()

    # 💊 Medicines table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicine TEXT,
        scheduled_time TEXT,
        added_at TEXT
    )
    """)

    # 📝 Medicine logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicine_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicine TEXT,
        scheduled_time TEXT,
        taken_time TEXT,
        date TEXT
    )
    """)

    conn.commit()
    conn.close()