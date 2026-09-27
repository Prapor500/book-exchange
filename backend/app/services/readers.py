from sqlalchemy import select
from sqlalchemy.orm import Session

from app.exceptions import ConflictError, NotFoundError
from app.models.booking import BookingStatus
from app.models.reader import Reader
from app.schemas.reader import ReaderCreate, ReaderUpdate


def list_readers(db: Session) -> list[Reader]:
    return list(db.scalars(select(Reader).order_by(Reader.full_name)))


def get_reader(db: Session, reader_id: int) -> Reader:
    reader = db.get(Reader, reader_id)
    if reader is None:
        raise NotFoundError(f"Читатель с id={reader_id} не найден")
    return reader


def _ensure_email_is_free(db: Session, email: str, ignore_reader_id: int | None = None) -> None:
    existing = db.scalar(select(Reader).where(Reader.email == email))
    if existing is not None and existing.id != ignore_reader_id:
        raise ConflictError(f"Читатель с email '{email}' уже зарегистрирован")


def create_reader(db: Session, data: ReaderCreate) -> Reader:
    _ensure_email_is_free(db, data.email)
    reader = Reader(full_name=data.full_name, email=data.email)
    db.add(reader)
    db.commit()
    db.refresh(reader)
    return reader


def update_reader(db: Session, reader_id: int, data: ReaderUpdate) -> Reader:
    reader = get_reader(db, reader_id)
    if data.email is not None and data.email != reader.email:
        _ensure_email_is_free(db, data.email, ignore_reader_id=reader_id)
        reader.email = data.email
    if data.full_name is not None:
        reader.full_name = data.full_name
    db.commit()
    db.refresh(reader)
    return reader


def delete_reader(db: Session, reader_id: int) -> None:
    reader = get_reader(db, reader_id)
    active_bookings = [b for b in reader.bookings if b.status == BookingStatus.ACTIVE]
    if active_bookings:
        raise ConflictError(
            "Нельзя удалить читателя, у которого есть активные бронирования"
        )
    db.delete(reader)
    db.commit()
