import html2canvas from "html2canvas";
import { Item } from "../../models/item";
import { Power } from "../../models/power";
import Skill from "../../models/skill";
import PerkExportableCard from "./perk-exportable-card";
import { createRoot } from "react-dom/client";
import { Theme, ThemeProvider } from "@mui/material";
import AppProviders from "../../contexts/app-context";

export const getPerksBlob = async (
  perks: {
    id: string;
    name: string;
    data: Item | Power;
    type: "power" | "item";
    skills?: Skill[];
  }[],
  theme: Theme
) => {
  const blobCache = new Map<string, Blob>();

  // Crée le conteneur invisible
  const captureContainer = document.createElement("div");
  captureContainer.style.cssText = `
  position: fixed;
  top: -9999px;
  left: -9999px;
  width: 600px;
  height: auto;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
`;
  document.body.appendChild(captureContainer);

  // Génère les thumbnails invisibles
  for (const perk of perks) {
    if (blobCache.has(perk.id)) continue;

    const wrapper = document.createElement("div");
    captureContainer.appendChild(wrapper);

    const root = createRoot(wrapper);
    root.render(
      <ThemeProvider theme={theme}>
        <AppProviders>
          <PerkExportableCard
            key={perk.id}
            perk={perk.data}
            perkType={perk.type}
            skills={perk.skills}
          />
        </AppProviders>
      </ThemeProvider>
    );

    // Attendre le rendu complet
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );

    await document.fonts.ready;

    await Promise.all(
      Array.from(wrapper.querySelectorAll("img"))
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
    );

    const canvas = await html2canvas(wrapper, {
      backgroundColor: "#000000",
      useCORS: true,
    });

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png")
    );
    if (blob) {
      blobCache.set(perk.id, blob);
    }
  }

  // Nettoie les composants
  document.body.removeChild(captureContainer);

  return blobCache;
};
