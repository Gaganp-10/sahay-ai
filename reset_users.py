import sqlite3

conn = sqlite3.connect("sahay.db")
cursor = conn.cursor()

cursor.execute("DELETE FROM users")

conn.commit()
conn.close()

print("Users table cleared.")