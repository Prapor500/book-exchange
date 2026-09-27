"""
Подключение к PostgreSQL и управление сессиями SQLAlchemy.

Engine создаётся один раз при старте приложения и переиспользуется для
всех запросов (внутри него — пул соединений с БД). Сессия — это, по сути,
одна "рабочая транзакция" с базой: для каждого HTTP-запроса создаётся
своя сессия и закрывается после того, как ответ отправлен.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url, pool_pre_ping=True)

# pool_pre_ping=True: перед тем как отдать соединение из пула, SQLAlchemy
# проверяет, что оно ещё живо. Без этого можно ловить редкие и непонятные
# ошибки, если БД разорвала "залежавшееся" соединение.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Базовый класс, от которого наследуются все модели SQLAlchemy."""

    pass


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI-зависимость: открывает сессию БД на время одного запроса
    и гарантированно закрывает её после, даже если внутри обработчика
    произошла ошибка (за счёт try/finally).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
