import { Component } from "solid-js";
import { AppBar, Toolbar, Typography, Box } from "@suid/material";

const Header: Component = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: "2.5rem",
              color: "primary.main",
              mt: 1,
            }}
          >
            Short URL
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
