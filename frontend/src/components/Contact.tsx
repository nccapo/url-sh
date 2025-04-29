import { Component } from "solid-js";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
} from "@suid/material";

const Contact: Component = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            Have questions or feedback? We'd love to hear from you. Fill out the
            form below and we'll get back to you as soon as possible.
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <TextField
              sx={{ borderRadius: 0 }}
              fullWidth
              label="Name"
              margin="normal"
              required
            />
            <TextField
              sx={{ borderRadius: 0 }}
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              required
            />
            <TextField
              sx={{ borderRadius: 0 }}
              fullWidth
              label="Message"
              multiline
              rows={4}
              margin="normal"
              required
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
            >
              Send Message
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Contact;
