import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArticleIcon from "@mui/icons-material/Article";
import HandymanIcon from "@mui/icons-material/Handyman";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TuneIcon from "@mui/icons-material/Tune";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useState } from "react";
import Tile from "./shared/Tile";

export default function MainNavigation() {
  const [currentRole, setCurrentRole] = useState(2);
  console.log(currentRole);

  return (
    <>
      <ToggleButtonGroup
        exclusive
        value={String(currentRole)}
        onChange={(_, val) => {
          console.log("val", val);
          setCurrentRole(Number(val));
        }}
      >
        <ToggleButton value={"2"}>Boss</ToggleButton>
        <ToggleButton value={"1"}>Mitarbeiter</ToggleButton>
      </ToggleButtonGroup>
      <ViewGrid>
        <Tile role={2} currentRole={currentRole} to="offers" title="Angebote">
          <ArticleIcon fontSize="large" color="secondary" />
        </Tile>
        <Tile
          role={2}
          currentRole={currentRole}
          to="invoices"
          title="Rechnungen"
        >
          <ReceiptLongIcon fontSize="large" color="error" />
        </Tile>

        <Tile role={2} currentRole={currentRole} to="time" title="Alle Stunden">
          <AccessTimeIcon fontSize="large" color="warning" />
        </Tile>
        <Tile
          role={1}
          currentRole={currentRole}
          to="time-capture"
          title="Zeiterfassung"
        >
          <MoreTimeIcon fontSize="large" color="success" />
        </Tile>

        <Tile
          role={2}
          currentRole={currentRole}
          to="constructions"
          title="Baustellen"
        >
          <HandymanIcon fontSize="large" color="secondary" />
        </Tile>
        <Tile
          role={1}
          currentRole={currentRole}
          to="upload"
          title="Datei Upload"
        >
          <UploadFileIcon fontSize="large" color="primary" />
        </Tile>

        <Tile role={2} currentRole={currentRole} to="options" title="Optionen">
          <TuneIcon fontSize="large" color="disabled" />
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
