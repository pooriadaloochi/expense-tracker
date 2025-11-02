import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data", "expenses.db")
DB_PATH = os.path.abspath(DB_PATH)

def create_connection():
    data_dir = os.path.dirname(DB_PATH)
    os.makedirs(data_dir, exist_ok=True)
    return sqlite3.connect(DB_PATH)

def create_table():
    conn = create_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            date TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()
