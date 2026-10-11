import { NavLink, Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container, Button, Stack } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PageTransition from "../shared/ui/PageTransition";

const navItems = [
  { to: "/", label: "Каталог", end: true },
  { to: "/bookings", label: "Мои брони" },
  { to: "/locations", label: "Точки выдачи" },
  { to: "/stats", label: "Статистика" },
];

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: { xs: 1.5, sm: 3 }, py: 1, flexWrap: "wrap", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MenuBookIcon sx={{ color: "secondary.main" }} />
            <Typography variant="h6" sx={{ color: "#FCFAF3", letterSpacing: 0.2, whiteSpace: "nowrap" }}>КнигоОбмен</Typography>
          </Box>
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                end={item.end}
                size="small"
                sx={{
                  color: "rgba(252,250,243,0.78)",
                  textTransform: "none",
                  fontSize: { xs: 12, sm: 14 },
                  minWidth: 0,
                  px: { xs: 1, sm: 1.5 },
                  borderRadius: 1,
                  "&.active": { color: "#FCFAF3", bgcolor: "rgba(252,250,243,0.12)" },
                  "&:hover": { bgcolor: "rgba(252,250,243,0.10)" },
                }}
              >{item.label}</Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <PageTransition><Outlet /></PageTransition>
      </Container>
      <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", py: 2, px: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">КнигоОбмен · Читайте, делитесь, возвращайте</Typography>
      </Box>
    </Box>
  );
}
