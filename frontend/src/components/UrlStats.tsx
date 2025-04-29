import { Component, createSignal, onMount, For } from "solid-js";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  Chip,
} from "@suid/material";
import HomeIcon from "@suid/icons-material/Home";
import LinkOffIcon from "@suid/icons-material/LinkOff";
import AutoFixHighIcon from "@suid/icons-material/AutoFixHigh";
import ShuffleIcon from "@suid/icons-material/Shuffle";
import CodeIcon from "@suid/icons-material/Code";
import LockIcon from "@suid/icons-material/Lock";
import AccessTimeIcon from "@suid/icons-material/AccessTime";
import OpenInNewIcon from "@suid/icons-material/OpenInNew";
import SearchIcon from "@suid/icons-material/Search";
import RefreshIcon from "@suid/icons-material/Refresh";
import ContentCopyIcon from "@suid/icons-material/ContentCopy";
import { useNavigate, useParams } from "@solidjs/router";

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
  };
};

type LastAccessedResponse = {
  last_accessed: {
    id: number;
    iid: string;
    short_url_id: number;
    accessed_at: string;
    user_agent: string;
    ip_address: string;
  };
};

type TopUserAgentsResponse = {
  top_user_agents: string[];
};

type UniqueIPsResponse = {
  unique_ips: string[];
};

const UrlStats: Component = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [urlStats, setUrlStats] = createSignal<
    ShortenerResponse["shortener"] | null
  >(null);
  const [lastAccessed, setLastAccessed] = createSignal<
    LastAccessedResponse["last_accessed"] | null
  >(null);
  const [topUserAgents, setTopUserAgents] = createSignal<string[]>([]);
  const [uniqueIPs, setUniqueIPs] = createSignal<string[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [error, setError] = createSignal<string>("");
  const [searchUrl, setSearchUrl] = createSignal<string>("");
  const [isSearching, setIsSearching] = createSignal<boolean>(false);
  const [showCopyNotification, setShowCopyNotification] =
    createSignal<boolean>(false);

  const fetchStats = async (code: string) => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch basic stats
      const response = await fetch(`http://localhost:8090/v1/shorten/${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch URL statistics");
      }

      const data: ShortenerResponse = await response.json();
      setUrlStats(data.shortener);

      // Fetch last accessed details
      const lastAccessedResponse = await fetch(
        `http://localhost:8090/v1/shorten/last?q=${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (lastAccessedResponse.ok) {
        const lastAccessedData: LastAccessedResponse =
          await lastAccessedResponse.json();
        setLastAccessed(lastAccessedData.last_accessed);
      }

      // Fetch top user agents
      const topAgentsResponse = await fetch(
        `http://localhost:8090/v1/shorten/top-agents?q=${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (topAgentsResponse.ok) {
        const topAgentsData: TopUserAgentsResponse =
          await topAgentsResponse.json();
        setTopUserAgents(topAgentsData.top_user_agents);
      }

      // Fetch unique IPs
      const uniqueIPsResponse = await fetch(
        `http://localhost:8090/v1/shorten/ips?q=${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (uniqueIPsResponse.ok) {
        const uniqueIPsData: UniqueIPsResponse = await uniqueIPsResponse.json();
        setUniqueIPs(uniqueIPsData.unique_ips);
      }
    } catch (error) {
      console.error("Error fetching URL statistics:", error);
      setError("Failed to load URL statistics");
      setUrlStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const findByShortUrl = async (shortUrl: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8090/v1/shorten/find?q=${shortUrl}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to find URL");
      }

      const data: ShortenerResponse = await response.json();
      setUrlStats(data.shortener);
      fetchStats(data?.shortener?.short_code);
    } catch (error) {
      console.error("Error finding URL:", error);
      setError("Failed to find URL");
      setUrlStats(null);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (searchUrl().trim()) {
      setIsSearching(true);
      findByShortUrl(searchUrl());
    }
  };

  const handleVisit = async (shortCode: string) => {
    try {
      // First increment the visit count
      await fetch(`http://localhost:8090/v1/shorten/${shortCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Then refresh the stats
      fetchStats(shortCode);
    } catch (error) {
      console.error("Error tracking visit:", error);
    }
  };

  const handleRefresh = () => {
    if (urlStats()?.short_code) {
      fetchStats(urlStats()!.short_code);
    }
  };

  const handleCopyShortUrl = async () => {
    console.log(1);
    if (urlStats()?.short_url) {
      try {
        await navigator.clipboard.writeText(urlStats()!.short_url);
        setShowCopyNotification(true);
        setTimeout(() => setShowCopyNotification(false), 3000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Never";

    try {
      // Parse the date string from the server
      // The database format is likely "2025-04-22 19:06:31.328000"
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      // Format the date with explicit timezone handling
      // Use UTC methods to ensure consistent display regardless of local timezone
      const year = date.getUTCFullYear();
      const month = date.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
      });
      const day = date.getUTCDate();
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date.getUTCSeconds().toString().padStart(2, "0");

      return `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} UTC`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  onMount(() => {
    if (params.shortCode) {
      fetchStats(params.shortCode);
    } else {
      setIsLoading(false);
    }
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
            URL Statistics
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
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
            Back to Home
          </Button>
        </Box>

        {!params.shortCode && (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 0,
              bgcolor: "background.paper",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              mb: 6,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Search URL Statistics
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter a shortened URL to view its statistics
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Shortened URL"
                variant="outlined"
                value={searchUrl()}
                onChange={(e) => setSearchUrl(e.target.value)}
                placeholder="e.g., http://localhost:8090/sK6epcpK or sK6epcpK"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={!searchUrl().trim() || isSearching()}
                startIcon={<SearchIcon />}
                sx={{
                  borderRadius: 0,
                  py: 1.5,
                  px: 3,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(144, 202, 249, 0.3)",
                }}
              >
                {isSearching() ? "Searching..." : "Search"}
              </Button>
            </Box>
          </Paper>
        )}

        {isLoading() ? (
          <Typography>Loading statistics...</Typography>
        ) : error() ? (
          <Paper
            elevation={3}
            sx={{
              p: 6,
              borderRadius: 0,
              bgcolor: "background.paper",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              minHeight: "300px",
            }}
          >
            <LinkOffIcon
              sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
            />
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "text.secondary" }}
            >
              URL Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              No statistics found for the provided URL.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setSearchUrl("")}
              startIcon={<SearchIcon />}
            >
              Try Another URL
            </Button>
          </Paper>
        ) : urlStats() ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
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
                    <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                      {urlStats()?.short_url}
                    </Typography>
                    <IconButton
                      onClick={handleCopyShortUrl}
                      sx={{
                        color: "primary.main",
                        "&:hover": {
                          bgcolor: "rgba(144, 202, 249, 0.08)",
                        },
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                    <Button
                      variant="text"
                      component="a"
                      href={urlStats()?.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => handleVisit(urlStats()!.short_code)}
                      sx={{
                        color: "primary.main",
                        "&:hover": {
                          bgcolor: "rgba(144, 202, 249, 0.08)",
                        },
                      }}
                    >
                      Visit
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Original URL: {urlStats()?.original_url}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "primary.main" }}
                    >
                      Statistics
                    </Typography>
                    <IconButton
                      onClick={handleRefresh}
                      sx={{ color: "primary.main" }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          bgcolor: "background.default",
                          borderRadius: 0,
                        }}
                      >
                        <LinkOffIcon
                          sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
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
                          borderRadius: 0,
                        }}
                      >
                        {urlStats()?.method === "CUSTOM" && (
                          <AutoFixHighIcon
                            sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                          />
                        )}
                        {urlStats()?.method === "RANDOM" && (
                          <ShuffleIcon
                            sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                          />
                        )}
                        {urlStats()?.method === "HASH" && (
                          <CodeIcon
                            sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                          />
                        )}
                        {urlStats()?.method === "SECURE" && (
                          <LockIcon
                            sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
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
                          Created: {formatDate(urlStats()?.last_modified)}
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
                          Last Accessed: {formatDate(urlStats()?.last_accessed)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Last Access Details */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    Last Access Details
                  </Typography>
                  {lastAccessed() ? (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        IP Address: {lastAccessed()?.ip_address}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        User Agent: {lastAccessed()?.user_agent}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accessed At: {formatDate(lastAccessed()?.accessed_at)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No access data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Top User Agents */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    Top User Agents
                  </Typography>
                  {topUserAgents().length > 0 ? (
                    <Box>
                      <For each={topUserAgents()}>
                        {(agent, index) => (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {index() + 1}. {agent}
                          </Typography>
                        )}
                      </For>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No user agent data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Unique IPs */}
            <Grid item xs={12}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    Unique IP Addresses ({uniqueIPs().length})
                  </Typography>
                  {uniqueIPs().length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <For each={uniqueIPs()}>
                        {(ip) => (
                          <Chip
                            label={ip}
                            size="small"
                            sx={{
                              bgcolor: "background.default",
                              color: "text.secondary",
                              "&:hover": {
                                bgcolor: "rgba(144, 202, 249, 0.08)",
                              },
                            }}
                          />
                        )}
                      </For>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No IP address data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : params.shortCode ? (
          <Typography>No statistics found for this URL.</Typography>
        ) : null}
      </Box>

      {showCopyNotification() && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            p: 2,
            borderRadius: 0,
            bgcolor: "primary.main",
            color: "white",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ContentCopyIcon />
          <Typography>Short URL copied to clipboard!</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default UrlStats;
