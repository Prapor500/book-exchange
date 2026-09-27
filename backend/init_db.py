"""
Скрипт подготовки базы данных.

Запуск:
    python init_db.py            # только создать таблицы
    python init_db.py --seed     # создать таблицы и наполнить демо-данными

Использует Base.metadata.create_all() — этого достаточно для лабораторной
работы. В более крупном проекте здесь были бы миграции Alembic вместо
прямого create_all(), чтобы аккуратно накатывать изменения схемы поверх
уже существующих данных.
"""

import sys
from datetime import date, timedelta

from app import models  # noqa: F401  — импорт нужен, чтобы модели зарегистрировались в Base.metadata
from app.database import Base, SessionLocal, engine
from app.models.book import Book, BookStatus
from app.models.booking import Booking, BookingStatus
from app.models.location import PickupLocation
from app.models.reader import Reader


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
    print("Таблицы созданы (или уже существовали).")


def seed_demo_data() -> None:
    db = SessionLocal()
    try:
        if db.query(PickupLocation).first() is not None:
            print("В базе уже есть данные — пропускаю заполнение демо-данными.")
            return

        sokol = PickupLocation(
            name="Точка выдачи «Сокол»", address="ул. Ленинградская, 12", hours="Пн–Пт 10:00–20:00"
        )
        central = PickupLocation(
            name="Точка выдачи «Центральная»", address="пр. Мира, 45", hours="Ежедневно 9:00–21:00"
        )
        university = PickupLocation(
            name="Точка выдачи «Университетская»",
            address="ул. Студенческая, 3",
            hours="Пн–Сб 8:00–19:00",
        )
        db.add_all([sokol, central, university])
        db.flush()  # чтобы у точек появились id ещё до commit

        books = [
            Book(
                title="Мастер и Маргарита", author="Михаил Булгаков", genre="Классика", year=1967,
                description="Роман о визите дьявола в Москву 1930-х.",
                status=BookStatus.AVAILABLE, location_id=sokol.id,
            ),
            Book(
                title="Тонкое искусство пофигизма", author="Марк Мэнсон", genre="Нон-фикшн", year=2016,
                description="Практичный взгляд на то, за что стоит переживать.",
                status=BookStatus.LOANED, location_id=central.id,
            ),
            Book(
                title="Дюна", author="Фрэнк Герберт", genre="Фантастика", year=1965,
                description="История о планете-пустыне Арракис.",
                status=BookStatus.AVAILABLE, location_id=central.id,
            ),
            Book(
                title="Sapiens: Краткая история человечества", author="Юваль Ной Харари",
                genre="Нон-фикшн", year=2011, description="Путь человечества от каменного века.",
                status=BookStatus.AVAILABLE, location_id=university.id,
            ),
            Book(
                title="Гарри Поттер и философский камень", author="Дж. К. Роулинг", genre="Фэнтези",
                year=1997, description="Первая книга о юном волшебнике.",
                status=BookStatus.AVAILABLE, location_id=university.id,
            ),
        ]
        db.add_all(books)
        db.flush()

        readers = [
            Reader(full_name="Анна Смирнова", email="anna.smirnova@example.com"),
            Reader(full_name="Игорь Петров", email="igor.petrov@example.com"),
        ]
        db.add_all(readers)
        db.flush()

        # Одна активная бронь и одна просроченная — чтобы сразу было видно
        # обе ветки бизнес-логики при первом запуске API.
        loaned_book = books[1]
        overdue_booking = Booking(
            book_id=loaned_book.id,
            reader_id=readers[0].id,
            location_id=loaned_book.location_id,
            reserved_on=date.today() - timedelta(days=20),
            due_date=date.today() - timedelta(days=6),
            status=BookingStatus.OVERDUE,
        )
        db.add(overdue_booking)

        db.commit()
        print("База наполнена демо-данными: 3 точки выдачи, 5 книг, 2 читателя, 1 бронь.")
    finally:
        db.close()


if __name__ == "__main__":
    create_tables()
    if "--seed" in sys.argv:
        seed_demo_data()
