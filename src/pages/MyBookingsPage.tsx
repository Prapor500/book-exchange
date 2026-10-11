import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmptyState from "../shared/ui/EmptyState";
import { books, locations } from "../data/mockData";
import { useBookingState } from "../features/booking/model/bookingStore";

const statusLabel: Record<string, { label: string; color: "success" | "error" | "default" }> = {
  active: { label: "Активна", color: "success" },
  overdue: { label: "Просрочена", color: "error" },
  returned: { label: "Возвращена", color: "default" },
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function MyBookingsPage() {
  const { bookings } = useBookingState();
  const navigate = useNavigate();
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("sm"));
  const [filter, setFilter] = useState("all");
  const visibleBookings = useMemo(() => bookings.filter((booking) => filter === "all" || booking.status === filter), [bookings, filter]);

  return (
    <Box>
      <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 2 }}>ВАША КОЛЛЕКЦИЯ</Typography>
      <Typography variant="h4" sx={{ mb: 1 }}>Мои бронирования</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Отслеживайте сроки и информацию о книгах, которые вы выбрали.</Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }} aria-label="Фильтр бронирований">
        {[{ id: "all", label: "Все" }, { id: "active", label: "Активные" }, { id: "overdue", label: "Просроченные" }, { id: "returned", label: "Возвращённые" }].map((item) =>
          <Chip key={item.id} clickable label={item.label} onClick={() => setFilter(item.id)} color={filter === item.id ? "secondary" : "default"} variant={filter === item.id ? "filled" : "outlined"} />
        )}
      </Box>
      {visibleBookings.length === 0 ? (
        <EmptyState title={bookings.length ? "Нет бронирований с таким статусом" : "Пока нет бронирований"} description={bookings.length ? "Выберите другой фильтр." : "Откройте каталог и забронируйте доступную книгу."} actionLabel={bookings.length ? "Показать все" : "Перейти в каталог"} onAction={() => bookings.length ? setFilter("all") : navigate("/")} />
      ) : (
        <TableContainer sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Table size={compact ? "small" : "medium"}>
            <TableHead><TableRow><TableCell>Книга</TableCell><TableCell>Точка выдачи</TableCell><TableCell>Дата брони</TableCell><TableCell>Вернуть до</TableCell><TableCell>Статус</TableCell></TableRow></TableHead>
            <TableBody>
              {visibleBookings.map((booking) => {
                const book = books.find((item) => item.id === booking.bookId);
                const location = locations.find((item) => item.id === booking.locationId);
                const status = statusLabel[booking.status] ?? statusLabel.active;
                return <TableRow key={booking.id} hover>
                  <TableCell sx={{ minWidth: 150 }}><Typography sx={{ fontWeight: 600 }}>{book?.title ?? "Книга удалена"}</Typography>{book && <Typography variant="caption" color="text.secondary">{book.author}</Typography>}</TableCell>
                  <TableCell>{location?.name ?? "Не указана"}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(booking.reservedOn)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(booking.dueDate)}</TableCell>
                  <TableCell><Chip size="small" label={status.label} color={status.color} /></TableCell>
                </TableRow>;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Button sx={{ mt: 3 }} variant="outlined" onClick={() => navigate("/")}>Найти ещё книги</Button>
    </Box>
  );
}
