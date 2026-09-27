from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.reader import ReaderCreate, ReaderRead, ReaderUpdate
from app.services import readers as readers_service

router = APIRouter(prefix="/readers", tags=["Readers"])


@router.get("", response_model=list[ReaderRead])
def list_readers(db: Session = Depends(get_db)):
    return readers_service.list_readers(db)


@router.post("", response_model=ReaderRead, status_code=status.HTTP_201_CREATED)
def create_reader(payload: ReaderCreate, db: Session = Depends(get_db)):
    return readers_service.create_reader(db, payload)


@router.get("/{reader_id}", response_model=ReaderRead)
def get_reader(reader_id: int, db: Session = Depends(get_db)):
    return readers_service.get_reader(db, reader_id)


@router.patch("/{reader_id}", response_model=ReaderRead)
def update_reader(reader_id: int, payload: ReaderUpdate, db: Session = Depends(get_db)):
    return readers_service.update_reader(db, reader_id, payload)


@router.delete("/{reader_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reader(reader_id: int, db: Session = Depends(get_db)):
    readers_service.delete_reader(db, reader_id)
