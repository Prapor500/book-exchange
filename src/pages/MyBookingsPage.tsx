import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";
import { bookings, books, locations } from "../data/mockData";

const statusLabel: Record<string, { label: string; color: "success" | "error" | "default" }> = {
  active: { label: "Активна", color: "success" },
  overdue: { label: "Просрочена", color: "error" },
  returned: { label: "Возвращена", color: "default" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function MyBookingsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Мои бронирования
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Следите за сроками возврата, чтобы не платить пени.
      </Typography>

      <Table sx={{ bgcolor: "background.paper" }}>
        <TableHead>
          <TableRow>
            <TableCell>Книга</TableCell>
            <TableCell>Точка выдачи</TableCell>
            <TableCell>Забронировано</TableCell>
            <TableCell>Вернуть до</TableCell>
            <TableCell>Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => {
            const book = books.find((b) => b.id === booking.bookId);
            const location = locations.find((l) => l.id === booking.locationId);
            const status = statusLabel[booking.status];
            return (
              <TableRow key={booking.id}>
                <TableCell sx={{ fontWeight: 600 }}>{book?.title}</TableCell>
                <TableCell>{location?.name}</TableCell>
                <TableCell>{formatDate(booking.reservedOn)}</TableCell>
                <TableCell>{formatDate(booking.dueDate)}</TableCell>
                <TableCell>
                  <Chip size="small" label={status.label} color={status.color} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {bookings.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 3 }}>
          У вас пока нет бронирований.
        </Typography>
      )}
    </Box>
  );
}
