from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Reader(Base):
    """Читатель — человек, который бронирует и забирает книги."""

    __tablename__ = "readers"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)

    # Один читатель может иметь много бронирований (1 ко многим).
    bookings: Mapped[list["Booking"]] = relationship(
        back_populates="reader", cascade="all, delete-orphan"
    )
