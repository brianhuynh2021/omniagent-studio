import os
import sqlite3
import threading
import time
from typing import Any, Dict, List, Optional
from contextlib import contextmanager

from app.core.config import settings
from app.core.security import hash_password

DB_PATH = os.environ.get(
    "USERS_DB_PATH",
    os.path.join(os.path.dirname(__file__), "users.db"),
)

def _db_url() -> str:
    return (os.environ.get("DATABASE_URL") or settings.DATABASE_URL or "").strip()

def using_postgres() -> bool:
    return bool(_db_url())

_lock = threading.Lock()

class _SqliteWrapper:
    def __init__(self, conn: sqlite3.Connection):
        self._conn = conn

    def execute(self, sql: str, params=()):
        q = sql.replace("%s", "?")
        return self._conn.execute(q, params)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

@contextmanager
def _connect():
    url = _db_url()
    if url:
        import psycopg
        from psycopg.rows import dict_row
        conn = psycopg.connect(url, row_factory=dict_row)
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()
    else:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        wrapped = _SqliteWrapper(conn)
        try:
            yield wrapped
            wrapped.commit()
        except Exception:
            wrapped.rollback()
            raise
        finally:
            wrapped.close()

def init_users_db():
    """Initialize the users table and seed a default admin if none exists."""
    with _lock, _connect() as conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at REAL NOT NULL
            )""" if not using_postgres() else
            """CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'user',
                is_active INT NOT NULL DEFAULT 1,
                created_at DOUBLE PRECISION NOT NULL
            )"""
        )

        # Check if admin user exists
        row = conn.execute("SELECT COUNT(*) AS n FROM users").fetchone()
        count = row["n"] if isinstance(row, dict) else row[0]
        if count == 0:
            env_admin_pass = os.environ.get("DEFAULT_ADMIN_PASSWORD", "").strip()
            if env_admin_pass:
                default_admin_pass = env_admin_pass
            else:
                # Generate a secure 16-char random password if none specified
                import secrets
                default_admin_pass = f"Aegis@{secrets.token_urlsafe(12)}"
                print(f"[SECURITY WARNING] No DEFAULT_ADMIN_PASSWORD set. Generated initial admin password: {default_admin_pass}")
            
            admin_hash = hash_password(default_admin_pass)
            now = time.time()
            conn.execute(
                """INSERT INTO users (username, email, hashed_password, role, is_active, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                ("admin", "admin@omniagent.ai", admin_hash, "admin", 1, now)
            )

def validate_password_strength(password: str):
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    weak_passwords = {"12345678", "password", "admin123", "password123", "qwerty123", "123456789"}
    if password.lower() in weak_passwords:
        raise ValueError("Password is too simple or common. Please choose a stronger password.")

def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    init_users_db()
    with _lock, _connect() as conn:
        row = conn.execute(
            "SELECT id, username, email, hashed_password, role, is_active, created_at FROM users WHERE username = %s",
            (username.strip(),)
        ).fetchone()
        if not row:
            return None
        return dict(row)

def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    init_users_db()
    with _lock, _connect() as conn:
        row = conn.execute(
            "SELECT id, username, email, hashed_password, role, is_active, created_at FROM users WHERE id = %s",
            (user_id,)
        ).fetchone()
        if not row:
            return None
        return dict(row)

def create_user(username: str, email: str, password: str, role: str = "user") -> Dict[str, Any]:
    init_users_db()
    username = username.strip()
    email = email.strip()
    validate_password_strength(password)
    
    valid_roles = ["admin", "attorney", "analyst", "user"]
    if role not in valid_roles:
        role = "user"
    
    hashed = hash_password(password)
    now = time.time()

    with _lock, _connect() as conn:
        existing = conn.execute(
            "SELECT id FROM users WHERE username = %s OR email = %s",
            (username, email)
        ).fetchone()
        if existing:
            raise ValueError("Username or email already exists")

        conn.execute(
            """INSERT INTO users (username, email, hashed_password, role, is_active, created_at)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (username, email, hashed, role, 1, now)
        )
        user = conn.execute(
            "SELECT id, username, email, role, is_active, created_at FROM users WHERE username = %s",
            (username,)
        ).fetchone()
        return dict(user)

def list_users() -> List[Dict[str, Any]]:
    init_users_db()
    with _lock, _connect() as conn:
        rows = conn.execute(
            "SELECT id, username, email, role, is_active, created_at FROM users ORDER BY id ASC"
        ).fetchall()
        return [dict(r) for r in rows]
