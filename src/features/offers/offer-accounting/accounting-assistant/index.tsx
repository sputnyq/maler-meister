import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';
import { Button } from '@mui/material';

import { useState } from 'react';

import { AppDialog } from '../../../../components/AppDialog';
import { AADialog } from './AADialog';

export function AccountingAssistant() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <AppDialog onClose={() => setDialogOpen(false)} open={dialogOpen} title="Rechnungsassistent">
        <AADialog />
      </AppDialog>
      <Button
        disableElevation
        variant="contained"
        onClick={() => setDialogOpen(true)}
        endIcon={<AssistantOutlinedIcon />}
      >
        Assistent
      </Button>
    </>
  );
}
