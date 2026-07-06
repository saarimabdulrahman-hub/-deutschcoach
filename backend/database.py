from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./deutschcoach.db")

connect_args = {}

if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False
elif "mysql" in DATABASE_URL or "pymysql" in DATABASE_URL:
    # Strip SSL params from URL (PyMySQL can't handle them as query params)
    parsed = urlparse(DATABASE_URL)
    params = parse_qs(parsed.query)
    ssl_keys = {"ssl", "ssl_mode", "ssl-mode"}
    has_ssl = any(k in params for k in ssl_keys)

    if has_ssl:
        clean_query = "&".join(
            f"{k}={v[0]}" for k, v in params.items() if k not in ssl_keys
        )
        DATABASE_URL = parsed._replace(query=clean_query).geturl()

    # Auto-enable SSL for non-local MySQL (Aiven, PlanetScale, RDS, etc.)
    host = parsed.hostname or ""
    is_local = host in ("localhost", "127.0.0.1", "db")
    if not is_local:
        connect_args["ssl"] = {"ssl_mode": "REQUIRED"}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
