"""
Импорт всех моделей в одном месте нужен для того, чтобы
Base.metadata.create_all(...) (см. init_db.py) увидело все таблицы:
SQLAlchemy регистрирует модель в metadata только после того, как файл
с её описанием был импортирован хотя бы раз.
"""

from app.models.book import Book, BookStatus
from app.models.booking import Booking, BookingStatus
from app.models.location import PickupLocation
from app.models.reader import Reader

__all__ = [
    "Book",
    "BookStatus",
    "Booking",
    "BookingStatus",
    "PickupLocation",
    "Reader",
]
