import { Box, Typography, Grid, Card, Chip } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { locations } from "../data/mockData";

export default function LocationsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Точки выдачи
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Заберите или верните книгу в одной из точек сети.
      </Typography>

      <Grid container spacing={2}>
        {locations.map((loc) => (
          <Grid item xs={12} sm={6} md={4} key={loc.id}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <PlaceIcon color="secondary" fontSize="small" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {loc.name}
                </Typography>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 0.5 }}>
                {loc.address}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {loc.hours}
              </Typography>
              <Chip
                size="small"
                variant="outlined"
                label={`${loc.booksAvailable} книг в наличии`}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
