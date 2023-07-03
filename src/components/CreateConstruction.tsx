import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { appRequest } from "../fetch/fetch-client";
import { AppDispatch } from "../store";
import { addActiveConstruction } from "../store/constructionReducer";
import { genericConverter } from "../utils";
import AddFab from "./shared/AddFab";
import { AppTextField } from "./shared/AppTextField";

export default function CreateConstruction() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateRequest = () => {
    appRequest("post")("constructions", { data: { name, active: true } })
      .then((data: any) => {
        const newConstruction = genericConverter<Construction>(data.data);
        dispatch(addActiveConstruction(newConstruction));
        setName("");
      })
      .catch((e) => {
        console.log(e);
        alert("Fehler! Baustelle konnte nicht erstellt werden.");
      })
      .finally(handleClose);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Baustelle erstellen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Es wird eine Aktive Baustelle angelegt.
          </DialogContentText>
          <Box minWidth={"270px"} marginY={2}>
            <AppTextField
              variant="standard"
              value={name}
              label="Name der Baustelle"
              onChange={(ev) => {
                setName(ev.target.value?.trim());
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Abbrechen</Button>
          <Button disabled={name.length === 0} onClick={handleCreateRequest}>
            Erstellen
          </Button>
        </DialogActions>
      </Dialog>
      <AddFab onClick={handleClickOpen} />
    </>
  );
}
