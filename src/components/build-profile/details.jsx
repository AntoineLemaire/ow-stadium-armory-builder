import React, { useRef, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Switch,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DetailsHeader from "./details-header";
import PerkMiniCard from "../common/perk-mini-card";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import StatsPanel from "./stats-panel";
import BuildRoundPanel from "./build-round-panel";
import { useHero } from "../../contexts/hero-context";
import { useUI } from "../../contexts/ui-context";
import { useBuild } from "../../contexts/build-context";
import BuildExportCanvas from "../capture/build-export-canvas";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import RenderPowers from "./powers-render.js";
import RenderItems from "./items-render.js";
import buildShareLink from "../../services/build-share-link";
import exportBuild from "../../services/export-build";

function Details() {
  const { t } = useTranslation("common");
  const { currentHero } = useHero();
  const { showMessage } = useUI();
  const {
    selectedItems,
    selectedPowers,
    removePerkBuild,
    setHoverPerk,
    keepItems,
    updateKeepItems,
    rounds,
  } = useBuild();

  const [showExport, setShowExport] = useState(false);

  const theme = useTheme();
  const exportRef = useRef();
  const powerColumns = 4;
  const itemColumns = 3;
  const itemRows = 2;

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const waitForImagesToLoad = (container) => {
    const images = Array.from(container.querySelectorAll("img"));
    const promises = images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
          } else {
            img.onload = () => {
              resolve();
            };
            img.onerror = () => {
              resolve();
            }; // resolve even on error to avoid hanging
          }
        })
    );
    return Promise.all(promises).then(() => undefined);
  };

  const handleCopy = async () => {
    setShowExport(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const element = exportRef.current;
    if (!element) return;

    // Wait for all images inside the export element to load (including fallback)
    await waitForImagesToLoad(element);

    const canvas = await html2canvas(element, {
      onclone: (clonedDoc) => {
        const clonedNode = clonedDoc.body.querySelector("[data-export-target]");
        if (clonedNode) {
          clonedNode.style.display = "block";
        }
      },
      scale: 1.25, // higher resolution screenshot
      allowTaint: false,
      imageTimeout: 10000,
      useCORS: true,
    });

    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        showMessage("Build copied to clipboard!", "success");
      } catch (err) {
        showMessage(`Failed to copy: ${err}, downloading instead.`, "error");

        // Fallback: Download as PNG
        const link = document.createElement("a");
        link.download = "image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } finally {
        setShowExport(false);
      }
    });
  };

  function canvasToBlobAsync(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to blob."));
        }
      }, "image/png");
    });
  }

  const downloadBuild = async () => {
    const zip = new JSZip();

    setShowExport(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const element = exportRef.current;
    if (!element) return;

    // Wait for all images inside the export element to load (including fallback)
    await waitForImagesToLoad(element);

    // Obtain the main build screenshot
    const canvas = await html2canvas(element, {
      onclone: (clonedDoc) => {
        const clonedNode = clonedDoc.body.querySelector("[data-export-target]");
        if (clonedNode) {
          clonedNode.style.display = "block";
        }
      },
      scale: 1.25, // higher resolution screenshot
      allowTaint: false,
      imageTimeout: 10000,
      useCORS: true,
    });

    const mainBlob = await canvasToBlobAsync(canvas);

    if (mainBlob) {
      zip.file(`${currentHero.name.toLowerCase()}-build.png`, mainBlob);
    }

    // Add a text file with the link to the build
    const shareLink = buildShareLink(exportBuild(currentHero, rounds));
    zip.file(`${currentHero.name.toLowerCase()}-link.txt`, shareLink);

    // Get all "data-key" elements (using Perks ID)
    const elements = document.querySelectorAll("[data-key]");

    // Round by round
    for (const round of rounds) {
      // Find all elements used in the current round
      for (const el of elements) {
        const perkId = el.getAttribute("data-key");

        if (
          round.powers.some((power) => power.id === perkId) ||
          round.items.some((item) => item.id === perkId)
        ) {
          const canvaElement = await html2canvas(el);
          const blob = await canvasToBlobAsync(canvaElement);
          if (blob) {
            const folder = zip.folder("screenshots/round-" + round.roundId);
            folder?.file(`${perkId}.png`, blob);
          }
        }
      }
    }

    // Génère et télécharge le zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "captures.zip");
  };

  const getPerkMiniCardDesktop = (perks, perkType, index) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          gap: 1,
        }}
        key={`${perkType}-${index}`}
      >
        <Typography variant="h6">
          {perkType === "power" && `${t("round")} ${2 * index + 1}`}
          {perkType === "item" && `${t("item")} ${index + 1}`}
        </Typography>
        <PerkMiniCard
          perk={perks[index]}
          perkType={perkType}
          setHoverPerk={setHoverPerk}
          unselectPerk={() => removePerkBuild(perkType, perks[index])}
          isDesktop={isDesktop}
        />
      </Box>
    );
  };

  const getPerkMiniCardMobile = (perks, perkType, index) => {
    return (
      <Box
        key={`${perkType}-${index}`}
        sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}
      >
        {perks.length === 0 && index === 0 && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {perkType === "power" ? t("selectPower") : t("selectItem")}
          </Typography>
        )}
        <Typography variant="h6">
          {perkType === "power" && `${t("round")} ${2 * index + 1}`}
          {perkType === "item" && `${t("item")} ${index + 1}`}
        </Typography>
        <PerkMiniCard
          perk={perks[index]}
          perkType={perkType}
          setHoverPerk={setHoverPerk}
          unselectPerk={() => removePerkBuild(perkType, perks[index])}
          isDesktop={isDesktop}
        />
      </Box>
    );
  };

  const getPerkMiniCard = (perks, perkType, index) => {
    if (isDesktop) {
      return getPerkMiniCardDesktop(perks, perkType, index);
    }
    return getPerkMiniCardMobile(perks, perkType, index);
  };

  if (!currentHero) {
    return;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        spacing={1}
        sx={{ flexGrow: 1, minHeight: 0, width: "100%", paddingBottom: 3 }}
      >
        <DetailsHeader copyBuild={handleCopy} downloadBuild={downloadBuild} />
        <BuildRoundPanel />
        <Card className="no-hover" sx={{ height: "100%" }}>
          <CardHeader title={t("power")} />
          <CardContent>
            <RenderPowers
              isDesktop={isDesktop}
              selectedPowers={selectedPowers}
              displayPerk={getPerkMiniCard}
            />
          </CardContent>
        </Card>

        <Card className="no-hover">
          <CardHeader title={t("items")} />
          <CardContent>
            <RenderItems
              isDesktop={isDesktop}
              selectedItems={selectedItems}
              displayPerk={getPerkMiniCard}
            />
          </CardContent>
        </Card>

        <Accordion
          defaultExpanded
          sx={{
            flexGrow: 1,
            minHeight: 0, // very important when you want internal scroll!
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Stats</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              flexGrow: 1,
              overflow: { xs: "visible", xl: "auto" },
            }}
          >
            <StatsPanel />
          </AccordionDetails>
        </Accordion>
      </Stack>

      {showExport && (
        <div
          ref={exportRef}
          data-export-target
          style={{
            display: "none",
            height: "auto",
            width: "2700px",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <BuildExportCanvas hero={currentHero} allRounds={rounds} />
        </div>
      )}
    </Box>
  );
}

export default Details;
