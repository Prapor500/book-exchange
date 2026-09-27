import enum
from datetime import date

from sqlalchemy import Date, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class BookingStatus(str, enum.Enum):
    ACTIVE = "active"
    OVERDUE = "overdue"
    RETURNED = "returned"


class Booking(Base):
    """
    Бронирование — связывает читателя, книгу и точку выдачи, фиксирует
    даты и статус. Это центральная сущность: именно через неё реализованы
    сценарии "забронировать" и "проследить срок возврата".
    """

    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)

    book_id: Mapped[int] = mapped_column(ForeignKey("books.id"), nullable=False)
    reader_id: Mapped[int] = mapped_column(ForeignKey("readers.id"), nullable=False)
    location_id: Mapped[int] = mapped_column(ForeignKey("pickup_locations.id"), nullable=False)

    reserved_on: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"), nullable=False, default=BookingStatus.ACTIVE
    )

    book: Mapped["Book"] = relationship(back_populates="bookings")
    reader: Mapped["Reader"] = relationship(back_populates="bookings")
    location: Mapped["PickupLocation"] = relationship(back_populates="bookings")
