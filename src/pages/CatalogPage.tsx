import { useMemo, useState } from "react";
import { Alert, Box, Button, Chip, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import BookCard from "../components/BookCard";
import EmptyState from "../shared/ui/EmptyState";
import { books } from "../data/mockData";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const genres = useMemo(() => Array.from(new Set(books.map((book) => book.genre))).sort(), []);
  const filtered = useMemo(() => books.filter((book) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
    const matchesQuery = !normalizedQuery ||
      book.title.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
      book.author.toLocaleLowerCase("ru-RU").includes(normalizedQuery);
    return matchesQuery && (!genre || book.genre === genre);
  }), [query, genre]);

  const resetFilters = () => { setQuery(""); setGenre(null); };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 2 }}>ОТКРЫВАЙТЕ НОВОЕ</Typography>
        <Typography variant="h4" sx={{ mb: 1 }}>Каталог книг</Typography>
        <Typography color="text.secondary">Найдите следующую книгу для чтения и выберите удобную точку выдачи.</Typography>
      </Box>
      <Box component="section" aria-label="Поиск и фильтрация книг" sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <TextField
          label="Поиск по названию или автору"
          placeholder="Например, Дюна или Булгаков"
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          inputProps={{ "aria-label": "Поиск книг по названию или автору" }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Жанр</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip label="Все жанры" clickable onClick={() => setGenre(null)} color={genre === null ? "secondary" : "default"} variant={genre === null ? "filled" : "outlined"} />
          {genres.map((item) => <Chip key={item} label={item} clickable onClick={() => setGenre(item)} color={genre === item ? "secondary" : "default"} variant={genre === item ? "filled" : "outlined"} />)}
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Typography color="text.secondary" aria-live="polite">Найдено книг: {filtered.length}</Typography>
        {(query || genre) && <Button size="small" startIcon={<FilterAltOffIcon />} onClick={resetFilters}>Сбросить фильтры</Button>}
      </Box>
      {filtered.length > 0 ? (
        <Grid container spacing={2}>
          {filtered.map((book) => <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}><BookCard book={book} /></Grid>)}
        </Grid>
      ) : (
        <EmptyState title="Книги не найдены" description="Измените поисковый запрос или сбросьте фильтры." actionLabel="Сбросить фильтры" onAction={resetFilters} />
      )}
      <Alert severity="info" sx={{ mt: 4 }}>Это демонстрационный каталог. Бронирования сохраняются в браузере на этом устройстве.</Alert>
    </Box>
  );
}
