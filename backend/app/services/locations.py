from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.exceptions import ConflictError, NotFoundError
from app.models.book import Book, BookStatus
from app.models.location import PickupLocation
from app.schemas.location import LocationCreate, LocationUpdate


def list_locations(db: Session) -> list[PickupLocation]:
    return list(db.scalars(select(PickupLocation).order_by(PickupLocation.name)))


def get_location(db: Session, location_id: int) -> PickupLocation:
    location = db.get(PickupLocation, location_id)
    if location is None:
        raise NotFoundError(f"Точка выдачи с id={location_id} не найдена")
    return location


def create_location(db: Session, data: LocationCreate) -> PickupLocation:
    location = PickupLocation(name=data.name, address=data.address, hours=data.hours)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location


def update_location(db: Session, location_id: int, data: LocationUpdate) -> PickupLocation:
    location = get_location(db, location_id)
    for field in ("name", "address", "hours"):
        value = getattr(data, field)
        if value is not None:
            setattr(location, field, value)
    db.commit()
    db.refresh(location)
    return location


def delete_location(db: Session, location_id: int) -> None:
    location = get_location(db, location_id)
    if location.books:
        raise ConflictError(
            "Нельзя удалить точку выдачи, за которой закреплены книги. "
            "Сначала перенесите книги в другую точку."
        )
    db.delete(location)
    db.commit()


def count_available_books(db: Session, location_id: int) -> int:
    """Сколько книг сейчас реально доступно к бронированию в этой точке."""
    count = db.scalar(
        select(func.count(Book.id)).where(
            Book.location_id == location_id, Book.status == BookStatus.AVAILABLE
        )
    )
    return count or 0
