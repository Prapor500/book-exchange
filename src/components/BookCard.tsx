import { Card, CardActionArea, Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Book } from "../types";
import { getBookStatus, useBookingState } from "../features/booking/model/bookingStore";

const statusConfig: Record<Book["status"], { label: string; color: "success" | "warning" | "error" }> = {
  available: { label: "Доступна", color: "success" },
  reserved: { label: "Забронирована", color: "warning" },
  loaned: { label: "На руках", color: "error" },
};

export default function BookCard({ book }: { book: Book }) {
  const navigate = useNavigate();
  useBookingState();
  const status = statusConfig[getBookStatus(book.id, book.status)];

  return (
    <Card sx={{ height: "100%", transition: "transform 180ms ease, box-shadow 180ms ease", "&:hover": { transform: "translateY(-3px)", boxShadow: 3 } }}>
      <CardActionArea onClick={() => navigate(`/books/${book.id}`)} sx={{ p: 2, height: "100%" }}>
        <Box sx={{ height: 160, bgcolor: book.coverColor, borderRadius: 1, mb: 2, display: "flex", alignItems: "flex-end", p: 1.5, position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", inset: 0, opacity: 0.12, background: "repeating-linear-gradient(135deg, transparent, transparent 8px, #fff 9px, transparent 10px)" }} />
          <Typography sx={{ color: "#FCFAF3", fontSize: 12, opacity: 0.9, position: "relative" }}>{book.genre}</Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25, mb: 0.75 }}>{book.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{book.author} · {book.year}</Typography>
        <Chip size="small" label={status.label} color={status.color} variant="outlined" />
      </CardActionArea>
    </Card>
  );
}
