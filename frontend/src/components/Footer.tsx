import { Component } from "solid-js";
import { Box, Container, Typography, Link } from "@suid/material";

const Footer: Component = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/contact"
            color="inherit"
            underline="hover"
            sx={{ textDecoration: "none" }}
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            color="inherit"
            underline="hover"
            sx={{ textDecoration: "none" }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            color="inherit"
            underline="hover"
            sx={{ textDecoration: "none" }}
          >
            Terms of Service
          </Link>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          © {new Date().getFullYear()} URL Shortener. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
