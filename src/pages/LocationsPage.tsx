import { useMemo, useState } from "react";
import { Box, Typography, Grid, Card, Chip, TextField, InputAdornment } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import SearchIcon from "@mui/icons-material/Search";
import EmptyState from "../shared/ui/EmptyState";
import { locations } from "../data/mockData";

export default function LocationsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => locations.filter((location) =>
    `${location.name} ${location.address}`.toLocaleLowerCase("ru-RU").includes(query.trim().toLocaleLowerCase("ru-RU"))
  ), [query]);

  return (
    <Box>
      <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 2 }}>РЯДОМ С ВАМИ</Typography>
      <Typography variant="h4" sx={{ mb: 1 }}>Точки выдачи</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Выберите удобное место, чтобы забрать или вернуть книгу.</Typography>
      <TextField label="Поиск по названию или адресу" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth sx={{ mb: 3, maxWidth: 520 }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
      {filtered.length ? <Grid container spacing={2}>
        {filtered.map((loc) => (
          <Grid item xs={12} sm={6} md={4} key={loc.id}>
            <Card sx={{ p: 3, height: "100%", transition: "transform 180ms ease, box-shadow 180ms ease", "&:hover": { transform: "translateY(-3px)", boxShadow: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <PlaceIcon color="secondary" fontSize="small" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{loc.name}</Typography>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 0.5 }}>{loc.address}</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>{loc.hours}</Typography>
              <Chip size="small" variant="outlined" color="success" label={`${loc.booksAvailable} книг в наличии`} />
            </Card>
          </Grid>
        ))}
      </Grid> : <EmptyState title="Точки не найдены" description="Попробуйте изменить поисковый запрос." actionLabel="Очистить поиск" onAction={() => setQuery("")} />}
    </Box>
  );
}
