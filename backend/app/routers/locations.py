from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.location import (
    LocationCreate,
    LocationRead,
    LocationUpdate,
    LocationWithStats,
)
from app.services import locations as locations_service

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("", response_model=list[LocationWithStats])
def list_locations(db: Session = Depends(get_db)):
    locations = locations_service.list_locations(db)
    return [
        LocationWithStats(
            **LocationRead.model_validate(loc).model_dump(),
            books_available=locations_service.count_available_books(db, loc.id),
        )
        for loc in locations
    ]


@router.post("", response_model=LocationRead, status_code=status.HTTP_201_CREATED)
def create_location(payload: LocationCreate, db: Session = Depends(get_db)):
    return locations_service.create_location(db, payload)


@router.get("/{location_id}", response_model=LocationWithStats)
def get_location(location_id: int, db: Session = Depends(get_db)):
    location = locations_service.get_location(db, location_id)
    return LocationWithStats(
        **LocationRead.model_validate(location).model_dump(),
        books_available=locations_service.count_available_books(db, location_id),
    )


@router.patch("/{location_id}", response_model=LocationRead)
def update_location(location_id: int, payload: LocationUpdate, db: Session = Depends(get_db)):
    return locations_service.update_location(db, location_id, payload)


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(location_id: int, db: Session = Depends(get_db)):
    locations_service.delete_location(db, location_id)
