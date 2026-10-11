import { Fade, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <Fade in key={pathname} timeout={220}>
      <Box>{children}</Box>
    </Fade>
  );
}
