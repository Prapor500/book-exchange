from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.exceptions import ConflictError, NotFoundError
from app.models.book import Book, BookStatus
from app.models.booking import Booking, BookingStatus
from app.models.location import PickupLocation
from app.schemas.book import BookCreate, BookUpdate


def _ensure_location_exists(db: Session, location_id: int) -> None:
    if db.get(PickupLocation, location_id) is None:
        raise NotFoundError(f"Точка выдачи с id={location_id} не найдена")


def list_books(
    db: Session,
    genre: str | None = None,
    status: BookStatus | None = None,
    search: str | None = None,
) -> list[Book]:
    query = select(Book).options(selectinload(Book.location))

    if genre:
        query = query.where(Book.genre == genre)
    if status:
        query = query.where(Book.status == status)
    if search:
        like = f"%{search.lower()}%"
        query = query.where(
            (Book.title.ilike(like)) | (Book.author.ilike(like))
        )

    return list(db.scalars(query.order_by(Book.title)))


def get_book(db: Session, book_id: int) -> Book:
    book = db.get(Book, book_id, options=[selectinload(Book.location)])
    if book is None:
        raise NotFoundError(f"Книга с id={book_id} не найдена")
    return book


def create_book(db: Session, data: BookCreate) -> Book:
    _ensure_location_exists(db, data.location_id)
    book = Book(
        title=data.title,
        author=data.author,
        genre=data.genre,
        year=data.year,
        description=data.description,
        location_id=data.location_id,
        status=BookStatus.AVAILABLE,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


def update_book(db: Session, book_id: int, data: BookUpdate) -> Book:
    book = get_book(db, book_id)

    if data.location_id is not None:
        _ensure_location_exists(db, data.location_id)
        book.location_id = data.location_id

    for field in ("title", "author", "genre", "year", "description", "status"):
        value = getattr(data, field)
        if value is not None:
            setattr(book, field, value)

    db.commit()
    db.refresh(book)
    return book


def delete_book(db: Session, book_id: int) -> None:
    book = get_book(db, book_id)
    has_open_bookings = db.scalar(
        select(Booking).where(
            Booking.book_id == book_id,
            Booking.status.in_([BookingStatus.ACTIVE, BookingStatus.OVERDUE]),
        )
    )
    if has_open_bookings is not None:
        raise ConflictError(
            "Нельзя удалить книгу: по ней есть активное или просроченное бронирование"
        )
    db.delete(book)
    db.commit()
