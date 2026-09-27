"""
Конфигурация приложения.

Все параметры, которые могут отличаться между окружениями (локальная
разработка, тесты, продакшн), читаются из переменных окружения — либо
напрямую из окружения процесса, либо из файла .env рядом с проектом.
Секреты (пароли, реальные адреса БД) в код и в git не попадают —
в репозитории лежит только .env.example с примером без настоящих значений.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Строка подключения к PostgreSQL. Формат:
    # postgresql+psycopg2://user:password@host:port/dbname
    database_url: str

    # "development" | "production" — используется, например, чтобы решать,
    # показывать ли пользователю подробности внутренней ошибки.
    app_env: str = "development"

    # Источник, с которого разрешено обращаться к API (frontend на Vite).
    cors_origin: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    """
    Настройки читаются один раз и кэшируются: не нужно заново парсить .env
    при каждом запросе, а FastAPI удобно подключать это как Depends(get_settings).
    """
    return Settings()
