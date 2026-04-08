import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

if os.environ.get("RAILWAY_ENVIRONMENT"):
    # En Railway: usa un volumen montado en /data para persistencia
    # Si no hay volumen, cae a /tmp (los datos se pierden al redeploy)
    data_dir = "/data" if os.path.isdir("/data") else "/tmp"
    db_path = os.path.join(data_dir, "quiniela.db")
elif os.environ.get("RENDER") == "true":
    db_path = "/tmp/quiniela.db"
else:
    db_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(db_dir, "quiniela.db")
    os.makedirs(db_dir, exist_ok=True)

SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
