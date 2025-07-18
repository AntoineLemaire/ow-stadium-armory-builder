import { Box } from "@mui/material";
import useAuthState from "../hooks/use-auth-state";

const LoginPage = () => {
  const { authContent } = useAuthState();

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
      {authContent}
    </Box>
  );
};

export default LoginPage;
