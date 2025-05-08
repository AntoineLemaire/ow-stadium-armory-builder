import { Box, Paper, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

function ArmoryFooter() {
  const { t } = useTranslation("footer");

  return (
    <Paper
      elevation={3}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 8,
        textAlign: "center",
        borderRadius: 0,
      }}
    >
      {t("left")}{" "}
      <Box component="span" sx={{ fontSize: "1.2em" }}>
        💖
      </Box>{" "}
      {t("right")}{" "}
      <Link
        target="_blank"
        rel="noreferrer"
        href="https://www.twitch.tv/gf_iguel"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        PositivitiLand
      </Link>
      !
    </Paper>
  );
}

export default ArmoryFooter;
