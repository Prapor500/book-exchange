from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.book import BookStatus
from app.schemas.book import BookCreate, BookRead, BookUpdate
from app.services import books as books_service

router = APIRouter(prefix="/books", tags=["Books"])


@router.get("", response_model=list[BookRead])
def list_books(
    genre: str | None = Query(default=None, description="Точное совпадение по жанру"),
    status_filter: BookStatus | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None, description="Поиск по названию или автору"),
    db: Session = Depends(get_db),
):
    return books_service.list_books(db, genre=genre, status=status_filter, search=search)


@router.post("", response_model=BookRead, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate, db: Session = Depends(get_db)):
    return books_service.create_book(db, payload)


@router.get("/{book_id}", response_model=BookRead)
def get_book(book_id: int, db: Session = Depends(get_db)):
    return books_service.get_book(db, book_id)


@router.patch("/{book_id}", response_model=BookRead)
def update_book(book_id: int, payload: BookUpdate, db: Session = Depends(get_db)):
    return books_service.update_book(db, book_id, payload)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    books_service.delete_book(db, book_id)
