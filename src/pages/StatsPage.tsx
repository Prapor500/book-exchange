import { Box, Typography, Grid, Card, LinearProgress, Alert } from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import StatCard from "../components/StatCard";
import { books, locations } from "../data/mockData";
import { palette } from "../theme";
import { useBookingState } from "../features/booking/model/bookingStore";

export default function StatsPage() {
  const { bookings, reservedBookIds } = useBookingState();
  const total = books.length;
  const available = books.filter((book) => book.status === "available" && !reservedBookIds.includes(book.id)).length;
  const loaned = books.filter((book) => book.status === "loaned").length;
  const overdue = bookings.filter((booking) => booking.status === "overdue").length;
  const genreCounts = books.reduce<Record<string, number>>((acc, book) => {
    acc[book.genre] = (acc[book.genre] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 2 }}>КНИЖНЫЙ ФОНД</Typography>
      <Typography variant="h4" sx={{ mb: 1 }}>Статистика</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Сводка по книгам, бронированиям и точкам выдачи.</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}><StatCard label="Всего книг" value={total} /></Grid>
        <Grid item xs={6} md={3}><StatCard label="Доступно сейчас" value={available} accent={palette.sage} /></Grid>
        <Grid item xs={6} md={3}><StatCard label="На руках" value={loaned} accent={palette.gold} /></Grid>
        <Grid item xs={6} md={3}><StatCard label="Просрочено" value={overdue} accent={palette.brick} /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}><AutoGraphIcon color="secondary" /><Typography variant="h6">Книги по жанрам</Typography></Box>
            {Object.entries(genreCounts).map(([genre, count]) => (
              <Box key={genre} sx={{ mb: 1.8 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{genre}</Typography>
                  <Typography variant="body2" color="text.secondary">{count} ({Math.round(count / total * 100)}%)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(count / total) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: "#EAE4D2", "& .MuiLinearProgress-bar": { bgcolor: palette.ink } }} />
              </Box>
            ))}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Книги в наличии по точкам</Typography>
            {locations.map((location) => (
              <Box key={location.id} sx={{ py: 1.5, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 0.75 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{location.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{location.booksAvailable}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{location.address}</Typography>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
      <Alert severity="info" sx={{ mt: 3 }}>Статистика рассчитывается по демонстрационным данным. Новые бронирования обновляют доступность книг и счётчики интерфейса.</Alert>
    </Box>
  );
}
