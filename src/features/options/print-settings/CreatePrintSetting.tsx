import { Card, CardContent, Grid } from '@mui/material';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import AddFab from '../../../components/AddFab';
import { AppDialog } from '../../../components/AppDialog';
import AppGrid from '../../../components/AppGrid';
import { AppTextField } from '../../../components/AppTextField';
import { AppDispatch } from '../../../store';
import { createPrintSettings } from '../../../store/printSettingsReducer';

export function CreatePrintSetting() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const onConfirm = async () => {
    await dispatch(createPrintSettings(name));
    handleClose();
  };

  return (
    <>
      <AppDialog
        title="PDF Einstellung anlegen"
        open={open}
        onClose={handleClose}
        onConfirm={onConfirm}
        confirmDisabled={name.length < 1}
      >
        <Card elevation={0}>
          <CardContent>
            <AppGrid>
              <Grid item xs={12}>
                <AppTextField label="Name" value={name} onChange={(ev) => setName(ev.target.value)} />
              </Grid>
            </AppGrid>
          </CardContent>
        </Card>
      </AppDialog>
      <AddFab onClick={handleOpen} />
    </>
  );
}
