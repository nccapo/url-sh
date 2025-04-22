import { Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { ThemeProvider, createTheme } from "@suid/material";
import CssBaseline from "@suid/material/CssBaseline";
import UrlShortener from "./components/UrlShortener";
import UrlStats from "./components/UrlStats";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        sx: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        sx: {
          borderRadius: 12,
        },
      },
    },
  },
});

const App: Component = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Route path="/" component={UrlShortener} />
        <Route path="/stats" component={UrlStats} />
        <Route path="/stats/:shortCode" component={UrlStats} />
      </Router>
    </ThemeProvider>
  );
};

export default App;
