import React from "react";
import {
  Typography,
  AppBar,
  Container,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageSwitcher from "./common/language-switcher";

function ArmoryHeader() {
  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            component="img"
            src={`${import.meta.env.BASE_URL}logo-light.svg`}
            alt="Overwatch Builds"
            sx={{
              height: 32,
              mr: 1,
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          />

          <Typography
            variant="h5"
            noWrap
            component="a"
            href={`${window.location.origin}${
              window.location.pathname.split("#")[0]
            }`}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Overwatch Builds - Armory Builder
          </Typography>
          
          <LanguageSwitcher />

          <Typography
            variant="h4"
            noWrap
            component="a"
            href={`${window.location.origin}${
              window.location.pathname.split("#")[0]
            }`}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "BigNoodleTitling",
              fontWeight: 600,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Overwatch Builds
          </Typography>

          <Box sx={{ flexGrow: 0, ml: "auto" }}>
            <IconButton
              component="a"
              href="https://github.com/gabrielgasnot/ow-stadium-armory-builder"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ArmoryHeader;
