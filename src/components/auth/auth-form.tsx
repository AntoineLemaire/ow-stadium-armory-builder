import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import PasswordStrengthBar from "./password-strength-bar";
import { useUI } from "../../contexts/ui-context";
import CloseIcon from "@mui/icons-material/Close";
import PrivacyPolicy from "./privacy-policy";

interface AuthFormProps {
  authMode: "signIn" | "register";
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  privacyPolicyAccepted: boolean;
  setPrivacyPolicyAccepted: (accepted: boolean) => void;
  error: string;
  onSignIn: () => void;
  onRegister: () => void;
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  authMode,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  privacyPolicyAccepted,
  setPrivacyPolicyAccepted,
  error,
  onSignIn,
  onRegister,
  onToggleMode,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [displayPrivacyPolicy, setDisplayPrivacyPolicy] = useState(false);
  const { setSnackBarMessage } = useUI();

  const closePrivacyPolicyDialog = () => {
    setDisplayPrivacyPolicy(false);
  };

  // Honeypot to detect bots
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nameRef.current?.value) {
      setSnackBarMessage("Bot detected - submission rejected");
      console.warn("Bot detected - submission rejected");
      return;
    } else {
      if (authMode === "signIn") {
        onSignIn();
      } else {
        onRegister();
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        width: 800,
      }}
      onSubmit={handleSubmit}
    >
      {authMode === "register" && (
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="small"
          required
          helperText="3-15 chars, letters, numbers, underscores"
        />
      )}
      {authMode === "register" && (
        <input
          type="text"
          name="name"
          style={{ display: "none" }}
          tabIndex={-1}
          ref={nameRef}
        />
      )}
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        required
      />
      {authMode === "signIn" && (
        <TextField
          fullWidth
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
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {authMode === "register" && (
        <>
          <Typography variant="caption" color="textSecondary">
            Your Privacy is <strong>really</strong> important to us, and we want
            to remind you that you can use the Armory Builder without creating
            an account.
            <br />
            Creating an account allows you to save your builds for easier
            access, vote for builds and other features that requires us to
            clearly identify a user.
            <br />
            However, a personal account is <strong>not</strong> mandatory as you
            can create a build and share it with the available options.
            <br />
            Our short (honestly, we wrote it as short as possible) Privacy
            Policy notice explains how we handle your data and what rights you
            have.
            <br />
          </Typography>
          <Box>
            <Checkbox
              required
              color="primary"
              value={privacyPolicyAccepted}
              onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
            />
            <Typography variant="caption" color="textSecondary">
              I have read and accept the{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => setDisplayPrivacyPolicy(true)}
                sx={{ padding: 0, textDecoration: "underline" }}
              >
                Privacy Policy
              </Button>
            </Typography>
          </Box>
        </>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
        {authMode === "signIn" ? (
          <Button
            variant="contained"
            onClick={onSignIn}
            sx={{ padding: "0px 10px 0px 10px" }}
          >
            Sign In
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            sx={{ padding: "0px 10px 0px 10px" }}
          >
            Register
          </Button>
        )}
        <Button
          variant="text"
          onClick={onToggleMode}
          sx={{ padding: "0px 10px 0px 10px" }}
        >
          {authMode === "signIn"
            ? "Create account"
            : "Have an account? Sign In"}
        </Button>
      </Box>

      {displayPrivacyPolicy && (
        <Dialog open={displayPrivacyPolicy} onClose={closePrivacyPolicyDialog}>
          <DialogTitle>Privacy Policy</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={closePrivacyPolicyDialog}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <PrivacyPolicy />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              autoFocus
              onClick={() => {
                closePrivacyPolicyDialog();
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AuthForm;
