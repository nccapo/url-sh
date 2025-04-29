import { Component, createSignal, createEffect } from "solid-js";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  FormControlLabel,
  Switch,
  IconButton,
} from "@suid/material";
import ContentCopyIcon from "@suid/icons-material/ContentCopy";
import SpeedIcon from "@suid/icons-material/Speed";
import SecurityIcon from "@suid/icons-material/Security";
import LinkIcon from "@suid/icons-material/Link";
import AnalyticsIcon from "@suid/icons-material/Analytics";
import AccessTimeIcon from "@suid/icons-material/AccessTime";
import DevicesIcon from "@suid/icons-material/Devices";
import AutoFixHighIcon from "@suid/icons-material/AutoFixHigh";
import ShuffleIcon from "@suid/icons-material/Shuffle";
import CodeIcon from "@suid/icons-material/Code";
import LockIcon from "@suid/icons-material/Lock";
import TimerIcon from "@suid/icons-material/Timer";
import HomeIcon from "@suid/icons-material/Home";
import LinkOffIcon from "@suid/icons-material/LinkOff";
import OpenInNewIcon from "@suid/icons-material/OpenInNew";
import SearchIcon from "@suid/icons-material/Search";
import BarChartIcon from "@suid/icons-material/BarChart";
import { useNavigate } from "@solidjs/router";

// Define URL shortening method types
type ShorteningMethod = "CUSTOM" | "RANDOM" | "HASH" | "SECURE";

// Define response type
type ShortenerResponse = {
  shortener: {
    iid: string;
    original_url: string;
    short_code: string;
    short_url: string;
    expiration: string;
    redirect_count: number;
    last_accessed: string;
    last_modified: string;
    method: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
};

const UrlShortener: Component = () => {
  const navigate = useNavigate();
  const [url, setUrl] = createSignal<string>("");
  const [shortenedUrl, setShortenedUrl] = createSignal<string>("");
  const [error, setError] = createSignal<string>("");
  const [customAlias, setCustomAlias] = createSignal<string>("");
  const [method, setMethod] = createSignal<ShorteningMethod>("RANDOM");
  const [enableExpiration, setEnableExpiration] = createSignal<boolean>(false);
  const [expiration, setExpiration] = createSignal<string>("");
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [showCopyTooltip, setShowCopyTooltip] = createSignal<boolean>(false);
  const [urlStats, setUrlStats] = createSignal<
    ShortenerResponse["shortener"] | null
  >(null);
  const [isLoadingStats, setIsLoadingStats] = createSignal<boolean>(false);
  const [shortCode, setShortCode] = createSignal<string>("");
  // UTM Parameters
  const [showUtmParams, setShowUtmParams] = createSignal<boolean>(false);
  const [utmSource, setUtmSource] = createSignal<string>("");
  const [utmMedium, setUtmMedium] = createSignal<string>("");
  const [utmCampaign, setUtmCampaign] = createSignal<string>("");
  const [utmTerm, setUtmTerm] = createSignal<string>("");
  const [utmContent, setUtmContent] = createSignal<string>("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate URL input
    if (!url().trim()) {
      setError("Please enter a URL to shorten");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8090/v1/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url(),
          method: method(),
          alias: customAlias(),
          utm_source: utmSource(),
          utm_medium: utmMedium(),
          utm_campaign: utmCampaign(),
          utm_term: utmTerm(),
          utm_content: utmContent(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data: ShortenerResponse = await response.json();
      console.log(data.shortener, "< - shorten");
      setShortenedUrl(data.shortener.short_url);
      navigate(`/stats/${data.shortener.short_code}`);
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl());
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const resetForm = () => {
    setUrl("");
    setShortenedUrl("");
    setError("");
    setCustomAlias("");
    setMethod("RANDOM");
    setEnableExpiration(false);
    setExpiration("");
    setUrlStats(null);
    // Reset UTM parameters
    setUtmSource("");
    setUtmMedium("");
    setUtmCampaign("");
    setUtmTerm("");
    setUtmContent("");
    setShowUtmParams(false);
  };

  // Get method description
  const getMethodDescription = (method: ShorteningMethod): string => {
    switch (method) {
      case "CUSTOM":
        return "Create a custom, memorable short URL with your own alias";
      case "RANDOM":
        return "Generate a random short URL with alphanumeric characters";
      case "HASH":
        return "Create a hash-based short URL";
      case "SECURE":
        return "Generate a secure, encrypted short URL with additional security";
      default:
        return "";
    }
  };

  // Get method icon
  const getMethodIcon = (method: ShorteningMethod) => {
    switch (method) {
      case "CUSTOM":
        return <AutoFixHighIcon sx={{ fontSize: 24, color: "primary.main" }} />;
      case "RANDOM":
        return <ShuffleIcon sx={{ fontSize: 24, color: "primary.main" }} />;
      case "HASH":
        return <CodeIcon sx={{ fontSize: 24, color: "primary.main" }} />;
      case "SECURE":
        return <LockIcon sx={{ fontSize: 24, color: "primary.main" }} />;
      default:
        return null;
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

  const handleShortUrlClick = async (shortCode: string): Promise<void> => {
    setIsLoadingStats(true);
    try {
      const response = await fetch(
        `http://localhost:8090/v1/shorten/${shortCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch URL statistics");
      }

      const data: ShortenerResponse = await response.json();
      setUrlStats(data.shortener);
    } catch (error) {
      console.error("Error fetching URL statistics:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleViewStats = () => {
    if (shortCode().trim()) {
      navigate(`/stats/${shortCode()}`);
    }
  };

  const handleGoToStats = () => {
    navigate("/stats");
  };

  // Add an effect to log when showUtmParams changes
  createEffect(() => {
    console.log("showUtmParams changed to:", showUtmParams());
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: "100%", minHeight: "100vh", py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            URL Shortener
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToStats}
            startIcon={<BarChartIcon />}
            sx={{
              py: 1.5,
              px: 3,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(144, 202, 249, 0.3)",
              borderRadius: 0,
            }}
          >
            View URL Statistics
          </Button>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 0.1,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            mb: 6,
            minHeight: "400px",
          }}
        >
          {!urlStats() ? (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    sx={{ borderRadius: 0 }}
                    fullWidth
                    label="Enter URL to shorten"
                    variant="outlined"
                    value={url()}
                    onChange={(e) => setUrl(e.target.value)}
                    error={!!error()}
                    helperText={error()}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Shortening Method</InputLabel>
                    <Select
                      value={method()}
                      onChange={(e) =>
                        setMethod(e.target.value as ShorteningMethod)
                      }
                      label="Shortening Method"
                    >
                      <MenuItem value="CUSTOM">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AutoFixHighIcon sx={{ color: "primary.main" }} />
                          <Box>
                            <Typography>Custom Alias</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Custom method generates a custom short URL with
                              your own alias
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="RANDOM">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <ShuffleIcon sx={{ color: "primary.main" }} />
                          <Box>
                            <Typography>Random</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Random method generates a random short URL with
                              alphanumeric characters
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="HASH">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CodeIcon sx={{ color: "primary.main" }} />
                          <Box>
                            <Typography>Hash</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Hash method generates a hash-based short URL
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="SECURE">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LockIcon sx={{ color: "primary.main" }} />
                          <Box>
                            <Typography>Secure</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Secure method generates a secure short URL with
                              additional security
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {method() === "CUSTOM" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Custom Alias"
                      variant="outlined"
                      value={customAlias()}
                      onChange={(e) => setCustomAlias(e.target.value)}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    variant={showUtmParams() ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => {
                      console.log(
                        "Toggle clicked, current value:",
                        showUtmParams()
                      );
                      setShowUtmParams(!showUtmParams());
                    }}
                    startIcon={showUtmParams() ? <LinkIcon /> : <LinkOffIcon />}
                    sx={{ mb: 2, borderRadius: 0, py: 1.5, px: 3 }}
                  >
                    {showUtmParams()
                      ? "Hide UTM Parameters"
                      : "Add UTM Parameters"}
                  </Button>
                </Grid>

                {showUtmParams() ? (
                  <Box sx={{ width: "100%", paddingLeft: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      UTM Parameters
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="UTM Source"
                          variant="outlined"
                          value={utmSource()}
                          onChange={(e) => setUtmSource(e.target.value)}
                          placeholder="e.g., newsletter"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="UTM Medium"
                          variant="outlined"
                          value={utmMedium()}
                          onChange={(e) => setUtmMedium(e.target.value)}
                          placeholder="e.g., email"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="UTM Campaign"
                          variant="outlined"
                          value={utmCampaign()}
                          onChange={(e) => setUtmCampaign(e.target.value)}
                          placeholder="e.g., summer_sale"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="UTM Term"
                          variant="outlined"
                          value={utmTerm()}
                          onChange={(e) => setUtmTerm(e.target.value)}
                          placeholder="e.g., running+shoes"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="UTM Content"
                          variant="outlined"
                          value={utmContent()}
                          onChange={(e) => setUtmContent(e.target.value)}
                          placeholder="e.g., textlink"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ) : null}

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading()}
                    sx={{
                      borderRadius: 0,
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    {isLoading() ? "Shortening..." : "Shorten URL"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5" sx={{ color: "primary.main" }}>
                  URL Statistics
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<HomeIcon />}
                  onClick={resetForm}
                  sx={{
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  Shorten Another URL
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: "100%", borderRadius: 0.1 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "primary.main" }}
                      >
                        Short URL
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
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
                        <Box sx={{ position: "relative" }}>
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
                          {showCopyTooltip() && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: "100%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                mb: 1,
                                px: 2,
                                py: 1,
                                bgcolor: "rgba(0, 0, 0, 0.8)",
                                color: "white",
                                borderRadius: 1,
                                fontSize: "0.875rem",
                                whiteSpace: "nowrap",
                                zIndex: 1000,
                                animation: "fadeIn 0.2s ease-in-out",
                                "@keyframes fadeIn": {
                                  from: {
                                    opacity: 0,
                                    transform: "translate(-50%, 10px)",
                                  },
                                  to: {
                                    opacity: 1,
                                    transform: "translate(-50%, 0)",
                                  },
                                },
                              }}
                            >
                              Copied to clipboard!
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Button
                          variant="text"
                          component="a"
                          href={shortenedUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<OpenInNewIcon />}
                          sx={{
                            color: "primary.main",
                            "&:hover": {
                              bgcolor: "rgba(144, 202, 249, 0.08)",
                            },
                          }}
                        >
                          Visit URL
                        </Button>
                        <Button
                          variant="text"
                          onClick={() =>
                            handleShortUrlClick(urlStats()?.short_code || "")
                          }
                          startIcon={<OpenInNewIcon />}
                          disabled={isLoadingStats()}
                          sx={{
                            color: "primary.main",
                            "&:hover": {
                              bgcolor: "rgba(144, 202, 249, 0.08)",
                            },
                          }}
                        >
                          {isLoadingStats()
                            ? "Refreshing..."
                            : "Refresh Statistics"}
                        </Button>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Original URL: {urlStats()?.original_url}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ height: "100%", borderRadius: 0.1 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "primary.main" }}
                      >
                        Statistics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 2,
                              bgcolor: "background.default",
                              borderRadius: 0.1,
                            }}
                          >
                            <LinkOffIcon
                              sx={{
                                fontSize: 40,
                                color: "primary.main",
                                mb: 1,
                              }}
                            />
                            <Typography
                              variant="h4"
                              sx={{ color: "primary.main", fontWeight: "bold" }}
                            >
                              {urlStats()?.redirect_count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Clicks
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 2,
                              bgcolor: "background.default",
                              borderRadius: 0.1,
                            }}
                          >
                            {urlStats()?.method === "CUSTOM" && (
                              <AutoFixHighIcon
                                sx={{
                                  fontSize: 40,
                                  color: "primary.main",
                                  mb: 1,
                                }}
                              />
                            )}
                            {urlStats()?.method === "RANDOM" && (
                              <ShuffleIcon
                                sx={{
                                  fontSize: 40,
                                  color: "primary.main",
                                  mb: 1,
                                }}
                              />
                            )}
                            {urlStats()?.method === "HASH" && (
                              <CodeIcon
                                sx={{
                                  fontSize: 40,
                                  color: "primary.main",
                                  mb: 1,
                                }}
                              />
                            )}
                            {urlStats()?.method === "SECURE" && (
                              <LockIcon
                                sx={{
                                  fontSize: 40,
                                  color: "primary.main",
                                  mb: 1,
                                }}
                              />
                            )}
                            <Typography
                              variant="h4"
                              sx={{ color: "primary.main", fontWeight: "bold" }}
                            >
                              {urlStats()?.method}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Shortening Method
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <AccessTimeIcon
                                sx={{ fontSize: 20, color: "primary.main" }}
                              />
                              Created:{" "}
                              {new Date(
                                urlStats()?.last_modified || ""
                              ).toLocaleString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <AccessTimeIcon
                                sx={{ fontSize: 20, color: "primary.main" }}
                              />
                              Last Accessed:{" "}
                              {new Date(
                                urlStats()?.last_accessed || ""
                              ).toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
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
                  borderRadius: 0.1,
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
