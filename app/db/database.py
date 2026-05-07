import sqlite3

DB_PATH = "sahay.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Medicines table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicine TEXT,
        scheduled_time TEXT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Medicine logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicine_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicine TEXT,
        scheduled_time TEXT,
        taken_time TEXT,
        date TEXT
    )
    """)

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        name TEXT,
        password TEXT
    )
    """)

    conn.commit()
    conn.close()