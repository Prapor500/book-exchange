import { Card, CardActionArea, Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Book } from "../types";

const statusConfig: Record<Book["status"], { label: string; color: "success" | "warning" | "error" }> = {
  available: { label: "Доступна", color: "success" },
  reserved: { label: "Забронирована", color: "warning" },
  loaned: { label: "На руках", color: "error" },
};

export default function BookCard({ book }: { book: Book }) {
  const navigate = useNavigate();
  const status = statusConfig[book.status];

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/books/${book.id}`)} sx={{ p: 2 }}>
        <Box
          sx={{
            height: 120,
            bgcolor: book.coverColor,
            borderRadius: 1,
            mb: 2,
            display: "flex",
            alignItems: "flex-end",
            p: 1.5,
          }}
        >
          <Typography sx={{ color: "#FCFAF3", fontSize: 12, opacity: 0.8 }}>
            {book.genre}
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {book.author} · {book.year}
        </Typography>
        <Chip size="small" label={status.label} color={status.color} variant="outlined" />
      </CardActionArea>
    </Card>
  );
}
