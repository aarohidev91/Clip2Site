from datetime import datetime, timezone


def new_user(name: str, email: str, password_hash: str) -> dict:
    return {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.now(timezone.utc),
    }
