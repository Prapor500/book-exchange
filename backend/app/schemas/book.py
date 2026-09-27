from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.book import BookStatus
from app.schemas.location import LocationRead


class BookBase(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    author: str = Field(min_length=1, max_length=200)
    genre: str = Field(min_length=1, max_length=100)
    year: int = Field(description="Год издания")
    description: str = Field(default="", max_length=2000)
    location_id: int = Field(description="ID точки выдачи, где физически находится книга")

    @field_validator("year")
    @classmethod
    def year_must_be_reasonable(cls, value: int) -> int:
        current_year = date.today().year
        if value < 1400 or value > current_year:
            raise ValueError(f"Год издания должен быть в диапазоне от 1400 до {current_year}")
        return value


class BookCreate(BookBase):
    # При создании статус всегда "доступна" — читатель не может завести
    # книгу сразу "на руках", это результат отдельного действия (бронирования).
    pass


class BookUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=300)
    author: str | None = Field(default=None, min_length=1, max_length=200)
    genre: str | None = Field(default=None, min_length=1, max_length=100)
    year: int | None = None
    description: str | None = Field(default=None, max_length=2000)
    location_id: int | None = None
    status: BookStatus | None = None

    @field_validator("year")
    @classmethod
    def year_must_be_reasonable(cls, value: int | None) -> int | None:
        if value is None:
            return value
        current_year = date.today().year
        if value < 1400 or value > current_year:
            raise ValueError(f"Год издания должен быть в диапазоне от 1400 до {current_year}")
        return value


class BookRead(BookBase):
    id: int
    status: BookStatus
    location: LocationRead

    model_config = ConfigDict(from_attributes=True)
