import { Box, Typography, Grid, Card, LinearProgress } from "@mui/material";
import StatCard from "../components/StatCard";
import { books, bookings, locations } from "../data/mockData";
import { palette } from "../theme";

export default function StatsPage() {
  const total = books.length;
  const available = books.filter((b) => b.status === "available").length;
  const loaned = books.filter((b) => b.status === "loaned").length;
  const overdue = bookings.filter((b) => b.status === "overdue").length;

  const genreCounts = books.reduce<Record<string, number>>((acc, b) => {
    acc[b.genre] = (acc[b.genre] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Статистика
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Общая картина по фонду книг и активным бронированиям.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <StatCard label="Всего книг" value={total} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Доступно сейчас" value={available} accent={palette.sage} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="На руках" value={loaned} accent={palette.gold} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Просрочено" value={overdue} accent={palette.brick} />
        </Grid>
      </Grid>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Книги по жанрам
        </Typography>
        {Object.entries(genreCounts).map(([genre, count]) => (
          <Box key={genre} sx={{ mb: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2">{genre}</Typography>
              <Typography variant="body2" color="text.secondary">
                {count}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(count / total) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "#EAE4D2",
                "& .MuiLinearProgress-bar": { bgcolor: palette.ink },
              }}
            />
          </Box>
        ))}
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Книги в наличии по точкам выдачи
        </Typography>
        {locations.map((loc) => (
          <Box
            key={loc.id}
            sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
          >
            <Typography variant="body2">{loc.name}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {loc.booksAvailable}
            </Typography>
          </Box>
        ))}
      </Card>
    </Box>
  );
}
