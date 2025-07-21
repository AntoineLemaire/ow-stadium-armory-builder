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
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HandymanIcon from "@mui/icons-material/Handyman";
import LoginIcon from "@mui/icons-material/Login";
import LanguageSwitcher from "./common/language-selector";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { useTranslation } from "react-i18next";

function ArmoryHeader() {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { t: tAuth } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { userProfile, handleSignOut, isAuthenticated } = useAuth();
  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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

              {isDesktop ? (
                <List sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                  {isAuthenticated ? (
                    <ListItem>
                      <Button
                        fullWidth
                        color="inherit"
                        startIcon={<HandymanIcon />}
                        sx={{
                          justifyContent: "flex-start",
                          whiteSpace: "nowrap",
                        }}
                        onClick={handleClick}
                      >
                        {userProfile?.username}
                      </Button>
                    </ListItem>
                  ) : (
                    <ListItem>
                      <Button
                        component={Link}
                        to="/login"
                        startIcon={<LoginIcon />}
                        sx={{
                          justifyContent: "flex-start",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tAuth("signIn")}
                      </Button>
                    </ListItem>
                  )}
                  <ListItem>
                    <Tooltip
                      id="button-codeRepo"
                      title={tCommon("visitUsOnGithub")}
                      arrow
                    >
                      <IconButton
                        edge="end"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="inherit"
                        href="https://github.com/gabrielgasnot/ow-stadium-armory-builder"
                        about="github"
                      >
                        <GitHubIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                </List>
              ) : (
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300 }}>
          <List>
            {isAuthenticated ? (
              <ListItem>
                <Button
                  fullWidth
                  startIcon={<HandymanIcon />}
                  sx={{
                    justifyContent: "flex-start",
                    padding: "10px ",
                  }}
                >
                  {userProfile?.username}
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
                  {tAuth("signInRegister")}
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
                <Button
                  fullWidth
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    handleSignOut();
                    setDrawerOpen(false);
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    padding: "10px ",
                  }}
                >
                  {tAuth("signOut")}
                </Button>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleSignOut();
            handleClose();
          }}
        >
          <ListItemIcon sx={{ color: "text.secondary" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{tAuth("signOut")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ArmoryHeader;
