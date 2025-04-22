import { Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { ThemeProvider, createTheme } from "@suid/material";
import CssBaseline from "@suid/material/CssBaseline";
import UrlShortener from "./components/UrlShortener";
import UrlStats from "./components/UrlStats";
import Contact from "./components/Contact";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import Layout from "./components/Layout";

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

// Wrapper components for each route
const HomePage: Component = () => (
  <Layout>
    <UrlShortener />
  </Layout>
);
const StatsPage: Component = () => (
  <Layout>
    <UrlStats />
  </Layout>
);
const ContactPage: Component = () => (
  <Layout>
    <Contact />
  </Layout>
);
const PrivacyPage: Component = () => (
  <Layout>
    <Privacy />
  </Layout>
);
const TermsPage: Component = () => (
  <Layout>
    <Terms />
  </Layout>
);

const App: Component = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/stats" component={StatsPage} />
        <Route path="/stats/:shortCode" component={StatsPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} />
      </Router>
    </ThemeProvider>
  );
};

export default App;
