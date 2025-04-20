import { Component, createSignal } from "solid-js";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@suid/material";
import ContentCopyIcon from "@suid/icons-material/ContentCopy";
import SpeedIcon from "@suid/icons-material/Speed";
import SecurityIcon from "@suid/icons-material/Security";
import LinkIcon from "@suid/icons-material/Link";
import AnalyticsIcon from "@suid/icons-material/Analytics";
import AccessTimeIcon from "@suid/icons-material/AccessTime";
import DevicesIcon from "@suid/icons-material/Devices";

const UrlShortener: Component = () => {
  const [url, setUrl] = createSignal<string>("");
  const [shortenedUrl, setShortenedUrl] = createSignal<string>("");
  const [error, setError] = createSignal<string>("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8090/v1/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url() }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      setShortenedUrl(data.shortUrl);
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
      console.error("Error:", err);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl());
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Feature cards data
  const features = [
    {
      title: "Lightning Fast",
      description:
        "Our URL shortener is optimized for speed, providing instant results.",
      icon: <SpeedIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Secure & Reliable",
      description:
        "Your links are protected with industry-standard security measures.",
      icon: <SecurityIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Custom Short Links",
      description: "Create memorable, branded short URLs for your business.",
      icon: <LinkIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Track clicks, locations, and devices for your shortened links.",
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Link Expiration",
      description: "Set expiration dates for your links to control access.",
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Cross-Platform",
      description: "Works seamlessly across all devices and platforms.",
      icon: <DevicesIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            mb: 4,
          }}
        >
          URL Shortener
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            mb: 6,
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter URL to shorten"
              variant="outlined"
              value={url()}
              onChange={(e) => setUrl(e.target.value)}
              error={!!error()}
              helperText={error()}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                mb: 3,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(144, 202, 249, 0.3)",
              }}
            >
              Shorten URL
            </Button>
          </form>

          {shortenedUrl() && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.light" }}
              >
                Shortened URL:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  fullWidth
                  value={shortenedUrl()}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.default",
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={copyToClipboard}
                  startIcon={<ContentCopyIcon />}
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: "primary.light",
                      bgcolor: "rgba(144, 202, 249, 0.08)",
                    },
                  }}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Feature Cards Section */}
        <Typography
          variant="h5"
          component="h2"
          align="center"
          sx={{
            mb: 4,
            color: "primary.light",
            fontWeight: "bold",
          }}
        >
          Why Choose Our URL Shortener?
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      color: "primary.main",
                      fontWeight: "bold",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default UrlShortener;
