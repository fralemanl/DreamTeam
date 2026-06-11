import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

is_railway = any(
    os.environ.get(var)
    for var in (
        "RAILWAY_ENVIRONMENT",
        "RAILWAY_ENVIRONMENT_NAME",
        "RAILWAY_PROJECT_ID",
        "RAILWAY_SERVICE_ID",
        "RAILWAY_STATIC_URL",
    )
)

if is_railway:
    # En Railway: usa /data si hay volumen; sin volumen usa /tmp (ephemeral)
    data_dir = "/data" if os.path.isdir("/data") else "/tmp"
    os.makedirs(data_dir, exist_ok=True)
    db_path = os.path.join(data_dir, "dreamteam.db")
elif os.environ.get("RENDER") == "true":
    db_path = "/tmp/dreamteam.db"
else:
    db_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(db_dir, "dreamteam.db")
    os.makedirs(db_dir, exist_ok=True)

SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
