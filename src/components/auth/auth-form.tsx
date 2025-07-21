import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import PasswordStrengthBar from "./password-strength-bar";
import { useUI } from "../../contexts/ui-context";
import CloseIcon from "@mui/icons-material/Close";
import PrivacyPolicy from "./privacy-policy";
import { Trans, useTranslation } from "react-i18next";

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
  error: string | null;
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
  const { t } = useTranslation("auth");
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
      setSnackBarMessage(t("botDetected"));
      console.warn(t("botDetected"));
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
          label={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="small"
          required
          helperText={t("usernameHelp")}
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
        label={t("email")}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        required
      />
      {authMode === "signIn" && (
        <TextField
          fullWidth
          label={t("password")}
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
          <Divider
            orientation="horizontal"
            variant="middle"
            sx={{
              borderColor: "#ffffff",
              justifyContent: "center",

              height: "1px",
            }}
          />
          <Typography variant="caption" color="textSecondary">
            <Trans
              i18nKey={t("privacyText.row1")}
              components={{ strong: <strong /> }}
            />
            <br />
            <Trans
              i18nKey={t("privacyText.row2")}
              components={{ strong: <strong /> }}
            />
            <br />
            <Trans
              i18nKey={t("privacyText.row3")}
              components={{ strong: <strong /> }}
            />
            <br />
            <Trans
              i18nKey={t("privacyText.row4")}
              components={{ strong: <strong /> }}
            />
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
              {t("privacyPolicyAccept")}{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => setDisplayPrivacyPolicy(true)}
                sx={{ padding: 0, textDecoration: "underline" }}
              >
                {t("privacyPolicy")}
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
            {t("signIn")}
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            sx={{ padding: "0px 10px 0px 10px" }}
          >
            {t("register")}
          </Button>
        )}
        <Button
          variant="text"
          onClick={onToggleMode}
          sx={{ padding: "0px 10px 0px 10px" }}
        >
          {authMode === "signIn" ? t("createAccount") : t("haveAccount")}
        </Button>
      </Box>

      {displayPrivacyPolicy && (
        <Dialog open={displayPrivacyPolicy} onClose={closePrivacyPolicyDialog}>
          <DialogTitle>{t("privacyPolicy")}</DialogTitle>
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
              {t("close")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AuthForm;
