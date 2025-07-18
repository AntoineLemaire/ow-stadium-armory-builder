import { useEffect, useState, useRef } from "react";
import "./app.css";
import {
  ArmoryHeader,
  ArmoryFooter,
  ArmoryMainContent,
  LoadingComponent,
} from "./components";
import {
  Box,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import owTheme from "./theme";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import ShareBuildModal from "./components/services/share-build";
import AppProviders from "./contexts/app-context";
import { useBuild } from "./contexts/build-context";
import { useUI } from "./contexts/ui-context";
import useBuildNavigation from "./hooks/use-build-navigation";
import SnackbarNotification from "./hooks/snackbar-notification";
import LoginPage from "./pages/login-page";

function App() {
  return (
    <HashRouter>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </HashRouter>
  );
}

function AppContent() {
  const { encodedString, navigation } = useBuildNavigation();
  const [loading, setLoading] = useState(true);
  const hasNavigated = useRef(false);

  const { encodedBuildId, setEncodedBuildId, shareLink, setShareLink } =
    useBuild();

  const { snackBarMessage, setSnackBarMessage, snackBarCategory } = useUI();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (!encodedString) {
      setLoading(false);
      return;
    }

    if (encodedString === "login") {
      setLoading(false);
      return;
    }

    if (!hasNavigated.current && encodedString) {
      hasNavigated.current = true;
      navigation(encodedString);
    }
  }, [encodedString, navigation]);

  if (loading) {
    return (
      <ThemeProvider theme={owTheme}>
        <CssBaseline />
        <LoadingComponent />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={owTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          overflowY: "auto",
        }}
      >
        <SnackbarNotification
          open={snackBarMessage}
          message={snackBarMessage}
          onClose={() => setSnackBarMessage("")}
          severity={snackBarCategory}
        />

        <ShareBuildModal
          encodedBuildId={encodedBuildId}
          generatedLink={shareLink}
          close={() => {
            setShareLink("");
            setEncodedBuildId("");
          }}
        />

        {/* Header (app bar) */}
        <ArmoryHeader />

        {/* Routing area */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={<ArmoryMainContent importBuild={navigation} />}
          />
          {/* Add more routes as needed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {isDesktop && <ArmoryFooter />}
        <div
          id="focus-dummy"
          tabIndex={-1}
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
