import { ThemeProvider, createTheme } from "@suid/material";
import CssBaseline from "@suid/material/CssBaseline";
import UrlShortener from "./components/UrlShortener";
import { Box } from "@suid/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <UrlShortener />
      </Box>
    </ThemeProvider>
  );
}

export default App;
