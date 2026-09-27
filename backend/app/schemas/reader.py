from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ReaderBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=200, description="Имя и фамилия читателя")
    email: EmailStr


class ReaderCreate(ReaderBase):
    pass


class ReaderUpdate(BaseModel):
    # Все поля необязательны — для частичного обновления (PATCH):
    # клиент присылает только то, что хочет изменить.
    full_name: str | None = Field(default=None, min_length=2, max_length=200)
    email: EmailStr | None = None


class ReaderRead(ReaderBase):
    id: int

    # from_attributes=True позволяет строить схему прямо из объекта
    # SQLAlchemy-модели (reader.full_name), а не только из словаря.
    model_config = ConfigDict(from_attributes=True)
