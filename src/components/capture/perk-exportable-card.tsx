import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  CardActions,
} from "@mui/material";
import HighlightText from "../common/highlight-text";
import PerkExportableAttributes from "./perk-exportable-attributes";
import { useTheme } from "@mui/material/styles";
import { Item, assertIsItem } from "../../models/item";
import { Power, assertIsPower } from "../../models/power";
import Skill from "../../models/skill";

function PerkExportableCard({
  perk,
  perkType,
  skills,
}: {
  perk: Item | Power;
  perkType: string;
  skills?: Skill[];
}) {
  const theme = useTheme();
  const [imgSrc, setImgSrc] = useState<string>(
    `${import.meta.env.BASE_URL}perks/${perk.id}.png`
  );

  const isPower = perkType === "power";

  return (
    <Card
      key={perk.id}
      data-key={perk.id}
      sx={{
        width: "100%",
        minWidth: "300px",
        mx: "auto",
        border: "2px solid",
        backgroundColor: theme.palette.background.paper,
        borderColor: "transparent",
        boxShadow: "none",
        transition: "border-color 0.3s ease"
      }}
    >
      {/* Header: Image + Name */}
      <CardHeader
        avatar={
          <Avatar
            src={imgSrc}
            alt={perk.name}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "white",
            }}
            variant={`${isPower ? "rounded" : "circular"}`}
            slotProps={{
              img: {
                loading: "lazy",
                onError: () =>
                  setImgSrc(`${import.meta.env.BASE_URL}perks/default.png`),
              },
            }}
          />
        }
        title={
          <Typography
            variant="h5"
            component="div"
            fontFamily="BigNoodleTitling"
            fontWeight="500"
            letterSpacing=".1rem"
            color="inherit"
            sx={{
              textDecoration: "none",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {perk.name}
          </Typography>
        }
        sx={{ alignItems: "center" }}
      />

      {/* Content: Description */}
      <CardContent>
        <Typography variant="body2" color="text.secondary" component="div">
          <HighlightText text={assertIsPower(perk) ? perk.description : ""} />
          <PerkExportableAttributes attributes={perk.attributes ?? []} skills={skills} />
        </Typography>
      </CardContent>

      {/* Actions: Price */}
      {assertIsItem(perk) && perk.price && (
        <CardActions
          sx={{
            justifyContent: "flex-end",
            alignContent: "flex-end",
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}icons/png/credit.png`}
            alt="credits"
            style={{ width: 24, height: 24 }}
          />
          <Typography variant="subtitle1">{perk.price}</Typography>
        </CardActions>
      )}
    </Card>
  );
}

export default PerkExportableCard;
