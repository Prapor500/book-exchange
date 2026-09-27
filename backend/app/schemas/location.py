from pydantic import BaseModel, ConfigDict, Field


class LocationBase(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    address: str = Field(min_length=5, max_length=300)
    hours: str = Field(min_length=2, max_length=100, description='Например: "Пн–Пт 10:00–20:00"')


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    address: str | None = Field(default=None, min_length=5, max_length=300)
    hours: str | None = Field(default=None, min_length=2, max_length=100)


class LocationRead(LocationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class LocationWithStats(LocationRead):
    """Точка выдачи вместе со сводкой по количеству книг — для экрана статистики."""

    books_available: int
