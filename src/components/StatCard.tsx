import { Card, Box, Typography } from "@mui/material";

export default function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <Typography variant="h3" sx={{ color: accent ?? "primary.main" }}>
          {value}
        </Typography>
      </Box>
    </Card>
  );
}
