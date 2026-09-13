import { useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Breadcrumbs,
  Link,
  Alert,
} from "@mui/material";
import { books, locations } from "../data/mockData";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === id);
  const [justBooked, setJustBooked] = useState(false);

  if (!book) {
    return (
      <Box>
        <Typography variant="h5">Книга не найдена</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Вернуться в каталог
        </Button>
      </Box>
    );
  }

  const location = locations.find((l) => l.id === book.locationId);

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Каталог
        </Link>
        <Typography color="text.primary">{book.title}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          height: 160,
          bgcolor: book.coverColor,
          borderRadius: 1,
          mb: 3,
        }}
      />

      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {book.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {book.author} · {book.year} · {book.genre}
      </Typography>

      <Typography sx={{ mb: 3 }}>{book.description}</Typography>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Место выдачи
      </Typography>
      <Typography sx={{ mb: 3 }}>
        {location?.name} — {location?.address} ({location?.hours})
      </Typography>

      {justBooked ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Книга забронирована. Заберите её в течение 3 дней в точке «{location?.name}».
        </Alert>
      ) : (
        <Button
          variant="contained"
          color="primary"
          disabled={book.status !== "available"}
          onClick={() => setJustBooked(true)}
        >
          {book.status === "available" ? "Забронировать" : "Недоступна для брони"}
        </Button>
      )}

      {book.status !== "available" && !justBooked && (
        <Chip
          sx={{ ml: 2 }}
          label={book.status === "loaned" ? "На руках у читателя" : "Уже забронирована"}
          variant="outlined"
        />
      )}
    </Box>
  );
}
