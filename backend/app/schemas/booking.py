from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.booking import BookingStatus
from app.schemas.book import BookRead
from app.schemas.location import LocationRead
from app.schemas.reader import ReaderRead


class BookingCreate(BaseModel):
    book_id: int
    reader_id: int
    # Необязательно: если не передать, сервис сам поставит срок — через
    # 14 дней от даты бронирования (business-логика, а не забота клиента).
    due_date: date | None = None

    @field_validator("due_date")
    @classmethod
    def due_date_not_in_past(cls, value: date | None) -> date | None:
        if value is not None and value < date.today():
            raise ValueError("Срок возврата не может быть в прошлом")
        return value


class BookingUpdate(BaseModel):
    """Продление срока — единственное, что можно поменять руками напрямую."""

    due_date: date = Field(description="Новый срок возврата")

    @field_validator("due_date")
    @classmethod
    def due_date_not_in_past(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("Срок возврата не может быть в прошлом")
        return value


class BookingRead(BaseModel):
    id: int
    reserved_on: date
    due_date: date
    status: BookingStatus
    book: BookRead
    reader: ReaderRead
    location: LocationRead

    model_config = ConfigDict(from_attributes=True)
