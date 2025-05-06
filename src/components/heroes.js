import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { useBuild } from "../contexts/build-context.js";
import { useDb } from "../contexts/db-context.js";

function Heroes({ currentHero }) {
  const { heroes, roles } = useDb();
  const { initBuild } = useBuild();

  const selectHero = (hero) => {
    initBuild(hero);
  };

  const getRoleHeroes = (role) => {
    const roleHeroes = heroes.filter((hero) => hero.role === role);
    return roleHeroes.map((hero) => (
      <Card
        key={`hero_${hero.id}`}
        onClick={() => selectHero(hero)}
        sx={{
          width: { xs: 100, sm: 125 },
          cursor: "pointer",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(25, 64, 97, 0.81)",
          },
        }}
        data-active={hero.id === currentHero ? "" : undefined}
      >
        <CardMedia
          sx={{ height: { xs: 100, sm: 125 } }}
          image={`${process.env.PUBLIC_URL}/heroes/${hero.id}.png`}
          title={hero.name}
        />
        <CardContent sx={{ alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6">{hero.name}</Typography>
        </CardContent>
      </Card>
    ));
  };

  if (heroes && heroes.length > 0) {
    return (
      <Stack
        direction="row"
        useFlexGap
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
          padding: 2,
        }}
      >
        {roles &&
          roles.map((role) => (
            <Box
              key={role}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: { xs: 64, md: 100 },
                  height: { xs: 64, md: 100 },
                  borderRadius: 1,
                  backgroundImage: `url(${process.env.PUBLIC_URL}/roles/${role}.svg)`,
                  filter: "invert(1)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0,
                }}
              />
              <Stack
                direction="row"
                spacing={2}
                useFlexGap
                sx={{
                  justifyContent: { xs: "center", sm: "flex-start" },
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {getRoleHeroes(role)}
              </Stack>
            </Box>
          ))}
      </Stack>
    );
  } else {
    return "Loading heroes...";
  }
}

export default Heroes;
