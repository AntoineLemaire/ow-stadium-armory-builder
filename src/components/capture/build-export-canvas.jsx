import { Box, Divider } from "@mui/material";
import BuildExportHeader from "./build-export-header";
import buildShareLink from "../../services/build-share-link";
import exportBuild from "../../services/export-build";
import BuildExportRound from "./build-export-round";

function BuildExportCanvas({ hero, allRounds }) {
  const shareLink = buildShareLink(exportBuild(hero, allRounds));

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          margin: 2,
          padding: 2,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <BuildExportHeader
          shareLink={shareLink}
          hero={hero}
          selectedItems={allRounds[6].items}
        />
      </Box>
      <Divider sx={{ color: "white" }} />
      <Box
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Do not print rounds without items. */}
        {allRounds
          .filter((round) => round.items.length > 0)
          .map((round, idx) => (
            <BuildExportRound round={round} key={idx} compact={false} />
          ))}
      </Box>
    </Box>
  );
}

export default BuildExportCanvas;
