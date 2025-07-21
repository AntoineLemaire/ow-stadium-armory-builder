import { Box } from "@mui/material";
import { useAuth } from "../../contexts/auth-context";
import AuthForm from "../../components/auth/auth-form";

const LoginPage = () => {
  const {
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
    handleRegister,
    handleSignIn,
    toggleAuthMode,
  } = useAuth();

  return (
    <Box
      id="login-page"
      sx={{
        display: "flex",
        width: "100%",
        textAlign: "center",
        alignContent: "center",
        justifyContent: "center",
        overflowY: "auto",
        paddingBottom: { xs: 0, md: "10px" },
      }}
    >
      <AuthForm
        authMode={authMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
        privacyPolicyAccepted={privacyPolicyAccepted}
        setPrivacyPolicyAccepted={setPrivacyPolicyAccepted}
        error={error}
        onSignIn={handleSignIn}
        onRegister={handleRegister}
        onToggleMode={toggleAuthMode}
      />
    </Box>
  );
};

export default LoginPage;
