import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


def normalize_database_url(url: str) -> str:
    """Normaliza URL de DB para SQLAlchemy (Railway suele usar postgres://)."""
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url

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

DB_FILE_PATH = None
DB_BACKEND = "external"
IS_EPHEMERAL_SQLITE = False

env_db_url = os.environ.get("DATABASE_URL") or os.environ.get("SQLALCHEMY_DATABASE_URL")

if env_db_url:
    SQLALCHEMY_DATABASE_URL = normalize_database_url(env_db_url)
else:
    DB_BACKEND = "sqlite"
    if is_railway:
        # Railway puede montar el volumen en rutas distintas; permite override por env.
        configured_data_dir = (
            os.environ.get("DATA_DIR")
            or os.environ.get("RAILWAY_VOLUME_MOUNT_PATH")
            or os.environ.get("VOLUME_MOUNT_PATH")
            or "/data"
        )
        # Sin ruta valida de volumen, cae en /tmp (ephemeral).
        data_dir = configured_data_dir if os.path.isdir(configured_data_dir) else "/tmp"
        os.makedirs(data_dir, exist_ok=True)
        db_path = os.path.join(data_dir, "dreamteam.db")
    elif os.environ.get("RENDER") == "true":
        db_path = "/tmp/dreamteam.db"
    else:
        db_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(db_dir, "dreamteam.db")
        os.makedirs(db_dir, exist_ok=True)

    DB_FILE_PATH = db_path
    IS_EPHEMERAL_SQLITE = db_path.startswith("/tmp/") or db_path == "/tmp/dreamteam.db"
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
