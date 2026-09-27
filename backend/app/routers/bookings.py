from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.booking import BookingCreate, BookingRead, BookingUpdate
from app.services import bookings as bookings_service

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("", response_model=list[BookingRead])
def list_bookings(
    reader_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return bookings_service.list_bookings(db, reader_id=reader_id)


@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    return bookings_service.create_booking(db, payload)


@router.get("/{booking_id}", response_model=BookingRead)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    return bookings_service.get_booking(db, booking_id)


@router.patch("/{booking_id}", response_model=BookingRead)
def extend_booking(booking_id: int, payload: BookingUpdate, db: Session = Depends(get_db)):
    """Продлить срок возврата брони."""
    return bookings_service.extend_booking(db, booking_id, payload)


@router.post("/{booking_id}/return", response_model=BookingRead)
def return_booking(booking_id: int, db: Session = Depends(get_db)):
    """Отметить книгу возвращённой — освобождает книгу для новых броней."""
    return bookings_service.return_booking(db, booking_id)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    bookings_service.delete_booking(db, booking_id)
