import { Grid, Typography } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Tile from "./shared/Tile";
import React from "react";
import HandymanIcon from "@mui/icons-material/Handyman";
import TuneIcon from "@mui/icons-material/Tune";

export default function MainNavigation() {
  return (
    <>
      <Typography variant="h6">Aufträge</Typography>
      <ViewGrid>
        <Tile to="offers" title="Angebote">
          <ArticleIcon fontSize="large" />
        </Tile>
        <Tile to="invoices" title="Rechnungen">
          <ReceiptLongIcon fontSize="large" />
        </Tile>
      </ViewGrid>
      <Typography variant="h6">Arbeitszeiten</Typography>
      <ViewGrid>
        <Tile to="time-capture" title="Zeiterfassung">
          <MoreTimeIcon fontSize="large" />
        </Tile>
        <Tile to="my-time" title="Meine Stunden">
          <AccessTimeIcon fontSize="large" />
        </Tile>
      </ViewGrid>
      <Typography variant="h6">Einstellungen</Typography>
      <ViewGrid>
        <Tile to="constructions" title="Baustellen">
          <HandymanIcon />
        </Tile>
        <Tile to="options" title="Optionen">
          <TuneIcon />
        </Tile>
      </ViewGrid>
    </>
  );
}

function ViewGrid({ children }: React.PropsWithChildren) {
  return (
    <Grid container spacing={3} p={2}>
      {children}
    </Grid>
  );
}
