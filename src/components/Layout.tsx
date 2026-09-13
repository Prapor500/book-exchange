import { NavLink, Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const navItems = [
  { to: "/", label: "Каталог", end: true },
  { to: "/bookings", label: "Мои брони" },
  { to: "/locations", label: "Точки выдачи" },
  { to: "/stats", label: "Статистика" },
];

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 4, py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MenuBookIcon sx={{ color: "secondary.main" }} />
            <Typography
              variant="h6"
              sx={{ color: "#FCFAF3", letterSpacing: 0.2 }}
            >
              КнигоОбмен
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            {navItems.map((item) => (
              <Typography
                key={item.to}
                component={NavLink}
                to={item.to}
                end={item.end as true | undefined}
                sx={{
                  color: "rgba(252,250,243,0.72)",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  pb: 0.5,
                  borderBottom: "2px solid transparent",
                  "&.active": {
                    color: "#FCFAF3",
                    borderBottom: "2px solid #B8863B",
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
