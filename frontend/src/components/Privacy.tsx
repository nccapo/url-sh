import { Component } from "solid-js";
import { Container, Typography, Box, Paper } from "@suid/material";

const Privacy: Component = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information that you provide directly to us, including:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">
              URLs that you submit for shortening
            </Typography>
            <Typography component="li" variant="body1">
              Usage statistics of shortened URLs
            </Typography>
            <Typography component="li" variant="body1">
              Contact information when you reach out to us
            </Typography>
          </ul>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">
              Provide and maintain our URL shortening service
            </Typography>
            <Typography component="li" variant="body1">
              Analyze and improve our service
            </Typography>
            <Typography component="li" variant="body1">
              Respond to your requests and support needs
            </Typography>
          </ul>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your
            information. However, no method of transmission over the internet is
            100% secure.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Privacy;
