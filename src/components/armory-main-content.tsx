import { Box } from "@mui/material";
import { CreateBuild, HeroPicker } from "../pages";
import { useHero } from "../contexts/hero-context";

interface ArmoryMainContentProps {
  importBuild: (buildData: string) => void;
}

function ArmoryMainContent({ importBuild }: ArmoryMainContentProps) {
  const { currentHero } = useHero();
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: { xs: "column", sm: "row" },
        overflow: "hidden",
        height: "100%",
        width: "100%",
        paddingBottom: { xs: "0px", md: "40px" },
      }}
    >
      {!currentHero && (
        <HeroPicker currentHero={currentHero} importBuild={importBuild} />
      )}
      {currentHero && <CreateBuild />}
    </Box>
  );
}

export default ArmoryMainContent;
