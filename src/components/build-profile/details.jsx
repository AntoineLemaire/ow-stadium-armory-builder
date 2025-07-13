import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
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
  Backdrop,
  CircularProgress,
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
import PerkCard from "../common/perk-card";
import { getPerksBlob } from "../capture/round-data";

function Details() {
  const { t } = useTranslation("common");
  const { currentHero, heroSkills } = useHero();
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
  const [exportProgress, setExportProgress] = useState("");
  const [usedPerks, setUsedPerks] = useState([]);

  const theme = useTheme();
  const exportRef = useRef();
  const exportRefBis = useRef();
  const powerColumns = 4;
  const itemColumns = 3;
  const itemRows = 2;

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const waitForImagesToLoad = (container, timeoutMs = 10000) => {
    const images = Array.from(container.querySelectorAll("img"));
    if (images.length === 0) return Promise.resolve();

    let resolvedCount = 0;

    return new Promise((resolve) => {
      const checkDone = () => {
        resolvedCount++;
        if (resolvedCount === images.length) resolve();
      };

      images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
          checkDone();
        } else {
          const done = () => {
            img.onload = null;
            img.onerror = null;
            checkDone();
          };
          img.onload = done;
          img.onerror = done;
        }
      });

      // Timeout de sécurité
      setTimeout(() => {
        console.warn(
          "⚠️ waitForImagesToLoad: Timeout reached, resolving anyway."
        );
        resolve();
      }, timeoutMs);
    });
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
          reject(new Error("Failed to generate blob from canvas"));
        }
      }, "image/png");
    });
  }

  const downloadBuild = async () => {
    setExportProgress(t("generatingZip"));
    setShowExport(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const zip = new JSZip();

      const perks = [];

      for (const round of rounds) {
        const newPowers = round.powers.filter(
          (power) => !perks.some((p) => p.id === power.id)
        );
        newPowers.forEach((power) =>
          perks.push({
            id: power.id,
            name: power.name,
            data: power,
            type: "power",
          })
        );

        const newItems = round.items.filter(
          (item) => !perks.some((i) => i.id === item.id)
        );
        newItems.forEach((item) =>
          perks.push({
            id: item.id,
            name: item.name,
            data: item,
            type: "item",
            skills: heroSkills,
          })
        );
      }

      setExportProgress(t("generatingZipBuild"));

      const perksBlob = await getPerksBlob(perks, theme);

      const element = exportRef.current;
      if (!element) return;

      // Wait for all images inside the export element to load (including fallback)
      await waitForImagesToLoad(element);

      // Obtain the main build screenshot
      const canvas = await html2canvas(element, {
        onclone: (clonedDoc) => {
          const clonedNode = clonedDoc.body.querySelector(
            "[data-export-target]"
          );
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

      // Build a list of powers and items used in the build
      for (const round of rounds) {
        const roundPerks = round.powers.concat(round.items);
        setExportProgress(t("generatingZipRound") + round.roundId);

        for (const roundPerk of roundPerks) {
          if (perksBlob.has(roundPerk.id)) {
            const perkBlob = perksBlob.get(roundPerk.id);
            const folder = zip.folder("perks/round-" + round.roundId);
            folder?.file(`${roundPerk.name}.png`, perkBlob);
          }
        }
      }

      setExportProgress(t("generatingZipFinal"));

      // Génère et télécharge le zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `owbuilds-${currentHero.name.toLowerCase()}.zip`);
    } finally {
      setExportProgress("");
      setShowExport(false);
    }
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

      <Backdrop
        open={showExport}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress color="inherit" />
          <Typography>{exportProgress}</Typography>
        </Box>
      </Backdrop>

      {showExport && (
        <div>
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
        </div>
      )}
    </Box>
  );
}

export default Details;
