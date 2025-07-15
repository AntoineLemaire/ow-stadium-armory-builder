import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import PerkPrintable from "../common/perk-printable";
import { GradedItem } from "../../models/graded-item";
import { Power } from "../../models/power";
import { Item } from "../../models/item";
import { Round } from "../../models/round";
import { useTranslation } from "react-i18next";
import StatsSummary from "./stats-summary";
import { JSX } from "react";

function BuildExportRound({
  round,
  compactMode,
}: {
  round: Round;
  compactMode: boolean;
}) {
  const { t } = useTranslation("common");

  const powerColumns = 4;
  const itemColumns = 3;
  const itemRows = 2;

  const displayPerk = (
    perks: (Item | Power | GradedItem)[],
    perkType: string,
    index: number
  ) => {
    if (!perks[index]) return null;
    return (
      <Box
        key={perks[index].id}
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Typography variant="h6">
          {perkType === "power" && `${t("round")} ${2 * index + 1}`}
          {perkType === "item" && `${t("item")} ${index + 1}`}
        </Typography>
        <PerkPrintable perk={perks[index]} compact={compactMode} />
      </Box>
    );
  };

  return (
    <Box
      key={round.id}
      sx={compactMode ? { width: 600 } : { margin: 2, width: 350 }}
    >
      <Typography variant="h5">
        {t("round")} {round.id}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <Typography variant="body2">{t("roundCost")}</Typography>
        <img
          src={`${import.meta.env.BASE_URL}icons/png/credit.png`}
          alt="credits"
          style={{ width: 24, height: 24, marginRight: 4 }}
        />
        <Typography variant="body2">
          {round.items.map((item) => item.price).reduce((a, b) => a + b, 0)}
        </Typography>
      </Box>
      <Stack
        spacing={1}
        sx={{
          flexGrow: 1,
          minHeight: 0,
          paddingBottom: 3,
        }}
      >
        <Card sx={{ boxShadow: "none" }}>
          <CardHeader title={t("power")} />
          <CardContent>
            <DisplayPowers
              compactMode={compactMode}
              maxPowers={powerColumns}
              roundPowers={round.powers}
              displayPerk={displayPerk}
            />
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: "none" }}>
          <CardHeader title={t("items")} />
          <CardContent>
            <DisplayItems
              compactMode={compactMode}
              itemRows={itemRows}
              itemColumns={itemColumns}
              roundItems={round.items}
              displayPerk={displayPerk}
            />
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: "none" }}>
          <CardHeader title="Stats" />
          <CardContent>
            <Grid
              container
              spacing={1}
              sx={{
                textAlign: "center",
              }}
            >
              <StatsSummary items={round.items} />
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

function DisplayPowers({
  compactMode,
  maxPowers,
  roundPowers,
  displayPerk,
}: {
  compactMode: boolean;
  maxPowers: number;
  roundPowers: Power[];
  displayPerk: (
    perks: (Item | Power | GradedItem)[],
    perkType: string,
    index: number
  ) => JSX.Element | null;
}) {
  return compactMode ? (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      {[...Array(maxPowers)].map((_, index) => (
        <Grid
          size={3}
          key={index}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {displayPerk(roundPowers, "power", index)}
        </Grid>
      ))}
    </Grid>
  ) : (
    <Stack
      spacing={2}
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {[...Array(maxPowers)].map((_, index) =>
        displayPerk(roundPowers, "power", index)
      )}
    </Stack>
  );
}

function DisplayItems({
  compactMode,
  itemRows,
  itemColumns,
  roundItems,
  displayPerk,
}: {
  compactMode: boolean;
  itemRows: number;
  itemColumns: number;
  roundItems: (Item | GradedItem)[];
  displayPerk: (
    perks: (Item | Power | GradedItem)[],
    perkType: string,
    index: number
  ) => JSX.Element | null;
}) {
  return compactMode ? (
    <Grid
      container
      spacing={1}
      sx={{
        textAlign: "center",
        backgroundColor: "transparent",
      }}
    >
      {[...Array(itemRows)].map((_, rowIndex) =>
        [...Array(itemColumns)].map((_, index) => (
          <Grid
            spacing={2}
            size={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            key={index}
          >
            {displayPerk(roundItems, "item", rowIndex * itemColumns + index)}
          </Grid>
        ))
      )}
    </Grid>
  ) : (
    <Stack
      spacing={2}
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      {[...Array(itemRows)].map((_, rowIndex) =>
        [...Array(itemColumns)].map((_, index) =>
          displayPerk(roundItems, "item", rowIndex * itemColumns + index)
        )
      )}
    </Stack>
  );
}

export default BuildExportRound;
