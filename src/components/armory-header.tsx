import {
  Typography,
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  ListItem,
  Drawer,
  List,
  Button,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HandymanIcon from "@mui/icons-material/Handyman";
import LoginIcon from "@mui/icons-material/Login";
import LanguageSwitcher from "./common/language-selector";
import { useState } from "react";
import useAuthState from "../hooks/use-auth-state";
import { Link } from "react-router-dom";

function ArmoryHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { userProfile, handleSignOut } = useAuthState();

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  return (
    <>
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

            <Box
              sx={{
                display: "flex",
                flexGrow: 0,
                ml: "auto",
                gap: {
                  xs: 0,
                  sm: 3,
                },
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box>
                <LanguageSwitcher />
              </Box>

              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300 }}>
          <List>
            {userProfile ? (
              <ListItem>
                <Button
                  fullWidth
                  href="https://github.com/gabrielgasnot/ow-stadium-armory-builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  startIcon={<HandymanIcon />}
                  sx={{
                    justifyContent: "flex-start",
                    padding: "10px ",
                  }}
                >
                  {userProfile.username}
                </Button>
              </ListItem>
            ) : (
              <ListItem>
                <Button
                  fullWidth
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    justifyContent: "flex-start",
                    padding: "10px ",
                  }}
                  onClick={() => setDrawerOpen(false)}
                >
                  Sign in / Register
                </Button>
              </ListItem>
            )}
            <ListItem>
              <Button
                fullWidth
                href="https://github.com/gabrielgasnot/ow-stadium-armory-builder"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                startIcon={<GitHubIcon />}
                sx={{
                  justifyContent: "flex-start",
                  padding: "10px ",
                }}
              >
                Github
              </Button>
            </ListItem>
            {userProfile && (
              <ListItem>
                <Button startIcon={<LogoutIcon />} onClick={handleSignOut}>
                  Sign out
                </Button>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default ArmoryHeader;
