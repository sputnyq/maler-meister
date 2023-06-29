import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, useTheme } from "@mui/material";
import { useState } from "react";
import AddFab from "../shared/AddFab";
import { AppFullScreenDialog } from "../shared/AppFullScreenDialog";

export default function TimeCaptureFlow() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppFullScreenDialog
        open={open}
        onClose={handleClose}
        title="Zeiten eintragen"
      >
        Zeiten eintragen
      </AppFullScreenDialog>
      <AddFab onClick={handleClickOpen} />
    </>
  );
}
