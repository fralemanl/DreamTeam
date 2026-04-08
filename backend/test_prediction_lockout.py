"""
Tests para asegurar que nadie puede hacer predicciones después de que un partido ha comenzado.

Ejecutar con:
    cd Quiniela/backend
    pip install pytest httpx
    python -m pytest test_prediction_lockout.py -v
"""
import os
import sys
import pytest
from datetime import datetime, timedelta
from unittest.mock import patch

# Forzar SQLite en memoria para tests
os.environ.pop("RAILWAY_ENVIRONMENT", None)
os.environ.pop("RENDER", None)

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
from models import User, Match, Prediction
from main import app, get_db, hash_password

# ── Base de datos en memoria para tests ──────────────────────────────────────
TEST_DATABASE_URL = "sqlite:///./test_lockout.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


# ── Fixtures ─────────────────────────────────────────────────────────────────
@pytest.fixture(autouse=True)
def setup_db():
    """Crea las tablas antes de cada test y las elimina después."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def user(db):
    """Crea un usuario de prueba."""
    u = User(
        username="testuser",
        email="test@example.com",
        password=hash_password("password123"),
        is_admin=False,
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


@pytest.fixture
def future_match(db):
    """Partido que aún no ha comenzado (mañana)."""
    m = Match(
        team_home="México",
        team_away="Brasil",
        match_date=datetime.utcnow() + timedelta(days=1),
        is_finished=False,
        phase="Fase de Grupos",
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@pytest.fixture
def started_match(db):
    """Partido que ya comenzó (hace 1 hora)."""
    m = Match(
        team_home="Argentina",
        team_away="Francia",
        match_date=datetime.utcnow() - timedelta(hours=1),
        is_finished=False,
        phase="Fase de Grupos",
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@pytest.fixture
def finished_match(db):
    """Partido finalizado."""
    m = Match(
        team_home="España",
        team_away="Alemania",
        match_date=datetime.utcnow() - timedelta(hours=3),
        score_home=2,
        score_away=1,
        winner="España",
        is_finished=True,
        phase="Fase de Grupos",
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


# ── Tests ────────────────────────────────────────────────────────────────────


class TestPredictionLockout:
    """Verifica que no se puedan crear/actualizar predicciones después de iniciado el partido."""

    # ── Crear predicción ─────────────────────────────────────────────────

    def test_prediction_allowed_for_future_match(self, user, future_match):
        """Se permite crear predicción si el partido no ha comenzado."""
        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={
                "match_id": future_match.id,
                "predicted_home": 2,
                "predicted_away": 1,
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["predicted_home"] == 2
        assert data["predicted_away"] == 1

    def test_prediction_blocked_for_started_match(self, user, started_match):
        """NO se permite crear predicción si el partido ya comenzó."""
        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={
                "match_id": started_match.id,
                "predicted_home": 1,
                "predicted_away": 0,
            },
        )
        assert resp.status_code == 400
        assert "ya comenzaron" in resp.json()["detail"]

    def test_prediction_blocked_for_finished_match(self, user, finished_match):
        """NO se permite crear predicción si el partido ya finalizó."""
        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={
                "match_id": finished_match.id,
                "predicted_home": 1,
                "predicted_away": 1,
            },
        )
        assert resp.status_code == 400
        assert "ya comenzaron" in resp.json()["detail"]

    # ── Actualizar predicción existente ──────────────────────────────────

    def test_update_prediction_blocked_after_match_starts(self, user, future_match, db):
        """
        Si un usuario hizo su predicción antes del inicio y luego intenta
        cambiarla después de que el partido arrancó, debe ser rechazado.
        """
        # Crear predicción válida mientras el partido es futuro
        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={
                "match_id": future_match.id,
                "predicted_home": 1,
                "predicted_away": 0,
            },
        )
        assert resp.status_code == 200

        # Simular que el partido ya comenzó moviendo match_date al pasado
        future_match.match_date = datetime.utcnow() - timedelta(minutes=5)
        db.commit()

        # Intentar actualizar la predicción → debe fallar
        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={
                "match_id": future_match.id,
                "predicted_home": 3,
                "predicted_away": 3,
            },
        )
        assert resp.status_code == 400
        assert "ya comenzaron" in resp.json()["detail"]

    # ── Borde: justo al minuto de inicio ─────────────────────────────────

    def test_prediction_blocked_exactly_at_match_time(self, user, db):
        """
        Si la hora actual es exactamente la hora del partido (o 1 segundo después),
        la predicción debe ser bloqueada.
        """
        now = datetime.utcnow()
        m = Match(
            team_home="Uruguay",
            team_away="Colombia",
            match_date=now - timedelta(seconds=1),
            is_finished=False,
            phase="Fase de Grupos",
        )
        db.add(m)
        db.commit()
        db.refresh(m)

        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={"match_id": m.id, "predicted_home": 0, "predicted_away": 0},
        )
        assert resp.status_code == 400

    def test_prediction_allowed_just_before_match(self, user, db):
        """Si faltan 30 segundos para el partido, todavía se puede predecir."""
        m = Match(
            team_home="Chile",
            team_away="Perú",
            match_date=datetime.utcnow() + timedelta(seconds=30),
            is_finished=False,
            phase="Fase de Grupos",
        )
        db.add(m)
        db.commit()
        db.refresh(m)

        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={"match_id": m.id, "predicted_home": 1, "predicted_away": 1},
        )
        assert resp.status_code == 200

    # ── Fase eliminatoria ────────────────────────────────────────────────

    def test_knockout_prediction_blocked_after_start(self, user, db):
        """También se bloquea en fase eliminatoria."""
        m = Match(
            team_home="Japón",
            team_away="Corea del Sur",
            match_date=datetime.utcnow() - timedelta(hours=1),
            is_finished=False,
            phase="Octavos",
        )
        db.add(m)
        db.commit()
        db.refresh(m)

        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={
                "match_id": m.id,
                "predicted_home": 2,
                "predicted_away": 2,
                "winner": "Japón",
            },
        )
        assert resp.status_code == 400
        assert "ya comenzaron" in resp.json()["detail"]

    # ── Partido inexistente ──────────────────────────────────────────────

    def test_prediction_for_nonexistent_match_returns_404(self, user):
        """Si el match_id no existe, error 404."""
        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={"match_id": 99999, "predicted_home": 0, "predicted_away": 0},
        )
        assert resp.status_code == 404

    # ── Predicción original se conserva si se intenta cambiar tarde ──────

    def test_original_prediction_preserved_after_lockout(self, user, future_match, db):
        """
        La predicción original debe conservarse intacta si el usuario
        intenta cambiarla después de que inició el partido.
        """
        # Crear predicción válida
        resp = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={
                "match_id": future_match.id,
                "predicted_home": 2,
                "predicted_away": 0,
            },
        )
        assert resp.status_code == 200
        original_id = resp.json()["id"]

        # Avanzar el tiempo: partido ya comenzó
        future_match.match_date = datetime.utcnow() - timedelta(minutes=10)
        db.commit()

        # Intento de cambio → bloqueado
        resp2 = client.post(
            "/api/predictions",
            params={"user_id": user.id},
            json={
                "match_id": future_match.id,
                "predicted_home": 5,
                "predicted_away": 5,
            },
        )
        assert resp2.status_code == 400

        # Verificar que la predicción original sigue igual
        pred = db.query(Prediction).filter(Prediction.id == original_id).first()
        assert pred.predicted_home == 2
        assert pred.predicted_away == 0


# ── Cleanup del archivo de test db ───────────────────────────────────────────
@pytest.fixture(scope="session", autouse=True)
def cleanup_test_db():
    yield
    engine.dispose()
    import os
    try:
        os.remove("./test_lockout.db")
    except (FileNotFoundError, PermissionError):
        pass
