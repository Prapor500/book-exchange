import enum

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class BookStatus(str, enum.Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    LOANED = "loaned"


class Book(Base):
    """Книга из общего фонда обмена."""

    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    author: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    genre: Mapped[str] = mapped_column(String(100), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[BookStatus] = mapped_column(
        Enum(BookStatus, name="book_status"), nullable=False, default=BookStatus.AVAILABLE
    )

    # Внешний ключ: каждая книга физически хранится в одной точке выдачи.
    location_id: Mapped[int] = mapped_column(ForeignKey("pickup_locations.id"), nullable=False)
    location: Mapped["PickupLocation"] = relationship(back_populates="books")

    # У одной книги за время жизни может быть много бронирований (история).
    bookings: Mapped[list["Booking"]] = relationship(back_populates="book")
