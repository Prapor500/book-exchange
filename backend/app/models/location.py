from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PickupLocation(Base):
    """Точка выдачи — место, где читатель забирает и возвращает книги."""

    __tablename__ = "pickup_locations"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address: Mapped[str] = mapped_column(String(300), nullable=False)
    hours: Mapped[str] = mapped_column(String(100), nullable=False)

    # У одной точки выдачи может физически храниться много книг.
    books: Mapped[list["Book"]] = relationship(back_populates="location")

    # И через неё же может проходить много бронирований.
    bookings: Mapped[list["Booking"]] = relationship(back_populates="location")
