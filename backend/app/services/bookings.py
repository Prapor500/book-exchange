from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.exceptions import ConflictError, NotFoundError
from app.models.book import Book, BookStatus
from app.models.booking import Booking, BookingStatus
from app.models.reader import Reader
from app.schemas.booking import BookingCreate, BookingUpdate

DEFAULT_LOAN_PERIOD = timedelta(days=14)

_LOAD_OPTIONS = [
    selectinload(Booking.book).selectinload(Book.location),
    selectinload(Booking.reader),
    selectinload(Booking.location),
]


def _refresh_overdue_status(db: Session, booking: Booking) -> Booking:
    """
    Просрочку не хранят "навсегда неверной": если активная бронь миновала
    срок возврата, при каждом чтении мы актуализируем её статус на OVERDUE.
    Это и есть бизнес-логика, вынесенная из модели данных и из роутера сюда.
    """
    if booking.status == BookingStatus.ACTIVE and booking.due_date < date.today():
        booking.status = BookingStatus.OVERDUE
        db.commit()
        db.refresh(booking)
    return booking


def list_bookings(db: Session, reader_id: int | None = None) -> list[Booking]:
    query = select(Booking).options(*_LOAD_OPTIONS)
    if reader_id is not None:
        query = query.where(Booking.reader_id == reader_id)
    bookings = list(db.scalars(query.order_by(Booking.due_date)))
    return [_refresh_overdue_status(db, b) for b in bookings]


def get_booking(db: Session, booking_id: int) -> Booking:
    booking = db.get(Booking, booking_id, options=_LOAD_OPTIONS)
    if booking is None:
        raise NotFoundError(f"Бронирование с id={booking_id} не найдено")
    return _refresh_overdue_status(db, booking)


def create_booking(db: Session, data: BookingCreate) -> Booking:
    book = db.get(Book, data.book_id)
    if book is None:
        raise NotFoundError(f"Книга с id={data.book_id} не найдена")

    reader = db.get(Reader, data.reader_id)
    if reader is None:
        raise NotFoundError(f"Читатель с id={data.reader_id} не найден")

    if book.status != BookStatus.AVAILABLE:
        raise ConflictError(
            f"Книгу «{book.title}» сейчас нельзя забронировать: она уже {book.status.value}"
        )

    reserved_on = date.today()
    due_date = data.due_date or (reserved_on + DEFAULT_LOAN_PERIOD)

    booking = Booking(
        book_id=book.id,
        reader_id=reader.id,
        location_id=book.location_id,
        reserved_on=reserved_on,
        due_date=due_date,
        status=BookingStatus.ACTIVE,
    )
    # Бронирование меняет и статус самой книги — это и есть связь между
    # сущностями, которую нужно обработать корректно (требование 6 из задания).
    book.status = BookStatus.RESERVED

    db.add(booking)
    db.commit()
    db.refresh(booking)
    # Перечитываем через get_booking, чтобы сразу подгрузить связанные
    # book/reader/location — они нужны схеме BookingRead для ответа.
    return get_booking(db, booking.id)


def extend_booking(db: Session, booking_id: int, data: BookingUpdate) -> Booking:
    booking = get_booking(db, booking_id)
    if booking.status == BookingStatus.RETURNED:
        raise ConflictError("Нельзя продлить уже возвращённую бронь")
    booking.due_date = data.due_date
    booking.status = BookingStatus.ACTIVE
    db.commit()
    return get_booking(db, booking_id)


def return_booking(db: Session, booking_id: int) -> Booking:
    """Читатель вернул книгу: бронь закрывается, книга снова доступна."""
    booking = get_booking(db, booking_id)
    if booking.status == BookingStatus.RETURNED:
        raise ConflictError("Эта бронь уже отмечена как возвращённая")

    booking.status = BookingStatus.RETURNED
    booking.book.status = BookStatus.AVAILABLE
    db.commit()
    return get_booking(db, booking_id)


def delete_booking(db: Session, booking_id: int) -> None:
    booking = get_booking(db, booking_id)
    if booking.status != BookingStatus.RETURNED:
        # Удаление незакрытой брони не должно "терять" книгу в статусе RESERVED
        # навсегда — возвращаем книгу в доступное состояние.
        booking.book.status = BookStatus.AVAILABLE
    db.delete(booking)
    db.commit()
