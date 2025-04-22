import { Component } from "solid-js";
import { Container, Typography, Box, Paper } from "@suid/material";

const Terms: Component = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Terms of Service
          </Typography>
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using this URL shortening service, you accept and
            agree to be bound by the terms and provision of this agreement.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Use License
          </Typography>
          <Typography variant="body1" paragraph>
            Permission is granted to temporarily use our URL shortening service
            for personal or commercial purposes, subject to the following
            restrictions:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">
              You must not use the service for any illegal purposes
            </Typography>
            <Typography component="li" variant="body1">
              You must not attempt to circumvent any service limitations or
              restrictions
            </Typography>
            <Typography component="li" variant="body1">
              You must not use the service to distribute malware or harmful
              content
            </Typography>
          </ul>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. Service Modifications
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify or discontinue, temporarily or
            permanently, the service with or without notice. We shall not be
            liable to you or any third party for any modification, suspension,
            or discontinuance of the service.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            In no event shall we be liable for any damages arising out of the
            use or inability to use the service, even if we have been notified
            of the possibility of such damages.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Terms;
