import { Box, Typography } from '@mui/material';

import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDialog } from '../../components/AppDialog';
import AddFab from '../../components/aa-shared/AddFab';
import { AppTextField } from '../../components/aa-shared/AppTextField';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { AppDispatch } from '../../store';
import { addActiveConstruction } from '../../store/constructionReducer';
import { genericConverter } from '../../utilities';

import { addDays } from 'date-fns';

export default function CreateConstruction() {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateRequest = () => {
    const start = new Date();
    const end = addDays(start, 2);
    appRequest('post')('constructions', {
      data: { name, active: true, tenant: user?.tenant, start, end } as Construction,
    })
      .then((data: any) => {
        const newConstruction = genericConverter<Construction>(data.data);
        dispatch(addActiveConstruction(newConstruction));
        setName('');
      })
      .catch((e) => {
        console.log(e);
        alert('Fehler! Baustelle konnte nicht erstellt werden.');
      })
      .finally(handleClose);
  };

  return (
    <>
      <AppDialog open={open} onClose={handleClose} onConfirm={handleCreateRequest} title="Baustelle erstellen">
        <Box p={2}>
          <AppTextField
            margin="normal"
            label="Name der Baustelle"
            value={name}
            onChange={(ev) => {
              setName(ev.target.value?.trimStart());
            }}
          />
          <Typography color={'GrayText'} variant="subtitle1">
            Es wird eine neue Baustelle angelegt und aktiviert. Die Baustelle ist für alle Mitarbeiter beim Eintragen
            der Arbeitszeit sichtbar.
          </Typography>
        </Box>
      </AppDialog>

      <AddFab onClick={handleClickOpen} />
    </>
  );
}
