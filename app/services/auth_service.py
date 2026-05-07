import sqlite3
import hashlib

DB_PATH = "sahay.db"


class AuthService:
    def __init__(self):
        self.create_users_table()

    def create_users_table(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

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

    def register_user(self, username, name, password):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()

            hashed_password = password

            cursor.execute("""
            INSERT INTO users (username, name, password)
            VALUES (?, ?, ?)
            """, (username, name, hashed_password))

            conn.commit()
            conn.close()

            return True

        except Exception as e:
            print(e)
            return False

    def login_user(self, username, password):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        hashed_password = password

        cursor.execute("""
        SELECT * FROM users
        WHERE username=? AND password=?
        """, (username, hashed_password))

        user = cursor.fetchone()

        conn.close()

        return user is not None

    def get_users(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("""
        SELECT username, name, password FROM users
        """)

        rows = cursor.fetchall()

        conn.close()

        credentials = {
            "usernames": {}
        }

        for username, name, password in rows:
            credentials["usernames"][username] = {
                "name": name,
                "password": password
            }

        return credentials


auth = AuthService()