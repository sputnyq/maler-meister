import { useState } from "react";
import { useLoadActiveConstructions } from "../../hooks/useLoadActiveConstructions";
import AddFab from "../shared/AddFab";
import { AppFullScreenDialog } from "../shared/AppFullScreenDialog";
import TimeEntryEditor from "../shared/TimeEntryEditor";

export default function TimeCaptureFlow() {
  useLoadActiveConstructions();

  const [open, setOpen] = useState(false);

  const [timeEntry, setTimeEntry] = useState({});

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
        <TimeEntryEditor />
      </AppFullScreenDialog>
      <AddFab onClick={handleClickOpen} />
    </>
  );
}
