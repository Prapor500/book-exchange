import { useMemo, useState } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { Alert, Box, Breadcrumbs, Button, Chip, Link, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { books, locations } from "../data/mockData";
import { getBookStatus, reserveBook, useBookingState } from "../features/booking/model/bookingStore";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookingState = useBookingState();
  const [message, setMessage] = useState("");
  const book = books.find((item) => item.id === id);
  const status = useMemo(() => book ? getBookStatus(book.id, book.status) : undefined, [book, bookingState]);
  const location = book ? locations.find((item) => item.id === book.locationId) : undefined;

  if (!book) {
    return (
      <Box sx={{ maxWidth: 640, mx: "auto", py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>Книга с таким идентификатором не найдена.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>Вернуться в каталог</Button>
      </Box>
    );
  }

  const isAvailable = status === "available";
  const handleBooking = () => {
    if (!location || !isAvailable) return;
    const success = reserveBook(book.id, location.id);
    setMessage(success ? "Книга забронирована. Заберите её в течение 3 дней в выбранной точке выдачи." : "Эта книга уже есть в бронированиях.");
  };

  const statusText = status === "available" ? "Доступна" : status === "reserved" ? "Забронирована" : "На руках";
  const statusColor = status === "available" ? "success" : status === "reserved" ? "warning" : "error";

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">Каталог</Link>
        <Typography color="text.primary">{book.title}</Typography>
      </Breadcrumbs>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "minmax(180px, 260px) 1fr" }, gap: { xs: 3, sm: 4 }, alignItems: "start" }}>
        <Box aria-label={`Обложка книги «${book.title}»`} sx={{ minHeight: 260, bgcolor: book.coverColor, borderRadius: 2, p: 3, display: "flex", alignItems: "flex-end", boxShadow: 3 }}>
          <Typography sx={{ color: "#FCFAF3", fontFamily: "Georgia, serif", fontSize: 22, lineHeight: 1.25 }}>{book.title}</Typography>
        </Box>
        <Box>
          <Chip label={statusText} color={statusColor} size="small" sx={{ mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 1 }}>{book.title}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{book.author} · {book.year} · {book.genre}</Typography>
          <Typography sx={{ lineHeight: 1.8, mb: 3 }}>{book.description}</Typography>
          <Box sx={{ p: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Точка выдачи</Typography>
            {location ? <>
              <Typography sx={{ fontWeight: 600 }}>{location.name}</Typography>
              <Typography color="text.secondary">{location.address}</Typography>
              <Typography color="text.secondary">{location.hours}</Typography>
            </> : <Typography color="text.secondary">Точка выдачи не указана.</Typography>}
          </Box>
          {message && <Alert severity={message.startsWith("Книга забронирована") ? "success" : "info"} sx={{ mb: 2 }}>{message}</Alert>}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="contained" disabled={!isAvailable || !location} onClick={handleBooking} startIcon={<EventAvailableIcon />}>
              {isAvailable ? "Забронировать книгу" : "Недоступна для брони"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/")}>Назад к каталогу</Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
