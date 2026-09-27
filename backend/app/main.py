"""
Точка входа backend-приложения: собирает все маршруты в один FastAPI-app,
подключает CORS для frontend и переводит внутренние исключения сервисов
в понятные HTTP-ответы.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.exceptions import ConflictError, NotFoundError
from app.routers import books, bookings, locations, readers

settings = get_settings()

app = FastAPI(
    title="КнигоОбмен API",
    description="Backend для проекта обмена книгами: каталог, бронирование, точки выдачи.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Обработчики ошибок -----------------------------------------------------
# Сервисы (app/services/*) ничего не знают про HTTP — они бросают
# NotFoundError / ConflictError с понятным текстом. Здесь эти исключения
# один раз переводятся в правильный статус-код и единый формат JSON-ответа
# {"detail": "..."} — такой же, какой FastAPI использует для HTTPException,
# так что клиенту не нужно различать источник ошибки.

@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(ConflictError)
async def conflict_handler(request: Request, exc: ConflictError):
    return JSONResponse(status_code=409, content={"detail": str(exc)})


# --- Маршруты ----------------------------------------------------------------

app.include_router(readers.router)
app.include_router(locations.router)
app.include_router(books.router)
app.include_router(bookings.router)


@app.get("/health", tags=["Service"])
def health_check():
    """Простой эндпоинт для проверки, что сервер и конфигурация подняты."""
    return {"status": "ok", "environment": settings.app_env}
