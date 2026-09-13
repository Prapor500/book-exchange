import { createTheme } from "@mui/material/styles";

/**
 * Визуальная идентичность «КнигоОбмена» отсылает к бумажному
 * библиотечному каталогу: чернильно-синий переплёт, тёплый пергамент,
 * тиснение цвета старой латуни и штамп цвета сургуча для просрочек.
 */
export const palette = {
  ink: "#1E2A38", // корешок / шапка / основной акцент
  inkLight: "#33465C",
  parchment: "#F3EFE3", // фон страницы
  card: "#FCFAF3", // карточки поверх пергамента
  gold: "#B8863B", // тиснение — сроки, ярлыки
  sage: "#54705F", // доступно / успех
  brick: "#9C3B34", // просрочено / внимание
  ink90: "#262321", // основной текст
  ink50: "#635C52", // вторичный текст
  line: "#DCD4C0", // разделители
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: palette.ink, light: palette.inkLight, contrastText: "#FCFAF3" },
    secondary: { main: palette.gold, contrastText: "#1E2A38" },
    success: { main: palette.sage },
    error: { main: palette.brick },
    background: { default: palette.parchment, paper: palette.card },
    text: { primary: palette.ink90, secondary: palette.ink50 },
    divider: palette.line,
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: palette.ink, boxShadow: "none" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 4, paddingInline: 18 },
        containedPrimary: { backgroundColor: palette.ink },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${palette.line}`,
          boxShadow: "none",
          backgroundColor: palette.card,
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 4, fontWeight: 600 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
});
