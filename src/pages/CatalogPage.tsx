import { useMemo, useState } from "react";
import { Box, Typography, TextField, Chip, Grid } from "@mui/material";
import BookCard from "../components/BookCard";
import { books } from "../data/mockData";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);

  const genres = useMemo(
    () => Array.from(new Set(books.map((b) => b.genre))),
    []
  );

  const filtered = books.filter((b) => {
    const matchesQuery =
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = !genre || b.genre === genre;
    return matchesQuery && matchesGenre;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Каталог книг
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Найдите книгу и забронируйте её в удобной точке выдачи.
      </Typography>

      <TextField
        placeholder="Поиск по названию или автору"
        fullWidth
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2, maxWidth: 420, bgcolor: "background.paper" }}
      />

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
        <Chip
          label="Все жанры"
          onClick={() => setGenre(null)}
          color={genre === null ? "secondary" : "default"}
          variant={genre === null ? "filled" : "outlined"}
        />
        {genres.map((g) => (
          <Chip
            key={g}
            label={g}
            onClick={() => setGenre(g)}
            color={genre === g ? "secondary" : "default"}
            variant={genre === g ? "filled" : "outlined"}
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        {filtered.map((book) => (
          <Grid item xs={12} sm={6} md={3} key={book.id}>
            <BookCard book={book} />
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">
              По вашему запросу ничего не найдено.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
