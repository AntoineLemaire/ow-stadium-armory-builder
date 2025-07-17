import {
  Typography,
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageSwitcher from "./common/language-selector";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Your firebase config file
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  doc,
  DocumentData,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import PasswordStrengthBar from "./common/password-strength-bar";
import zxcvbn from "zxcvbn";

function ArmoryHeader() {
  // const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  // Drawer open state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auth mode: "signIn" or "register"
  const [authMode, setAuthMode] = useState("signIn");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Error message
  const [error, setError] = useState("");

  // Current user state
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<DocumentData | null>(null); // to store username from Firestore

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setError("");
      if (firebaseUser) {
        // Fetch user profile (username) from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Toggle drawer open/close
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
    setError("");
    // Reset form fields when drawer closes
    if (!open) {
      setEmail("");
      setPassword("");
      setUsername("");
      setAuthMode("signIn");
    }
  };

  // Validate username format (simple example)
  const isValidUsername = (name: string) => /^[a-zA-Z0-9_]{3,15}$/.test(name);

  // Handle registration
  const handleRegister = async () => {
    setError("");
    if (!email || !password || !username) {
      setError("Please fill all fields.");
      return;
    }
    if (!isValidUsername(username)) {
      setError(
        "Username must be 3-15 characters, letters, numbers, or underscores."
      );
      return;
    }

    if (zxcvbn(password).score < 3) {
      setError("Password is not strong enough.");
      return;
    }

    try {
      // Check if username is taken
      const usernameDoc = await getDoc(doc(db, "usernames", username));
      if (usernameDoc.exists()) {
        setError("Username is already taken.");
        return;
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Save username linked to uid
      await setDoc(doc(db, "users", uid), {
        username,
        role: "user", // default role
        createdAt: serverTimestamp(),
        lastConnection: serverTimestamp(),
      });
      await setDoc(doc(db, "usernames", username), { uid });

      // Clear form and close drawer
      setEmail("");
      setPassword("");
      setUsername("");
      setAuthMode("signIn");
      setDrawerOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  // Handle sign in
  const handleSignIn = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      const creds = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, "users", creds.user.uid), {
        lastConnection: serverTimestamp(),
      });
      setEmail("");
      setPassword("");
      setDrawerOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Auth form JSX
  const AuthForm = () => (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}
      onSubmit={(e) => e.preventDefault()}
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        required
      />
      {authMode === "signIn" && (
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          required
        />
      )}
      {authMode === "register" && (
        <PasswordStrengthBar password={password} setPassword={setPassword} />
      )}
      {authMode === "register" && (
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="small"
          required
          helperText="3-15 chars, letters, numbers, underscores"
        />
      )}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {authMode === "signIn" ? (
          <Button variant="contained" onClick={handleSignIn}>
            Sign In
          </Button>
        ) : (
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
        )}
        <Button
          variant="text"
          onClick={() => {
            setError("");
            setAuthMode(authMode === "signIn" ? "register" : "signIn");
          }}
        >
          {authMode === "signIn"
            ? "Create account"
            : "Have an account? Sign In"}
        </Button>
      </Box>
    </Box>
  );

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

            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

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
              <Box>
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
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300 }}>
          <List>
            {user ? (
              <>
                <ListItem>
                  <ListItemText
                    primary={`Hello, ${userProfile?.username || user.email}`}
                  />
                </ListItem>
                <ListItem onClick={handleSignOut}>
                  <ListItemText primary="Sign Out" />
                </ListItem>
                <Divider />
                {/* Add other navigation items here */}
                <ListItem>
                  <ListItemText primary="Option 1" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Option 2" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem>
                  <ListItemText
                    primary={authMode === "signIn" ? "Sign In" : "Register"}
                  />
                </ListItem>
                <ListItem>{AuthForm()}</ListItem>
                <Divider />
                {/* Other navigation items */}
                <ListItem>
                  <ListItemText primary="Option 1" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Option 2" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default ArmoryHeader;
