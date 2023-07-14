import { useState } from 'react';

import AddFab from '../../components/aa-shared/AddFab';
import EditConstructionDialog from './EditConstructionDialog';

import { addDays } from 'date-fns';

interface Props {
  onCreateSuccess?: () => void;
}

export function CreateConstruction({ onCreateSuccess }: Props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const start = new Date();
  const end = addDays(start, 2);

  return (
    <>
      <EditConstructionDialog
        onCreateSuccess={onCreateSuccess}
        constructionId={undefined}
        dialogOpen={open}
        onClose={handleClose}
        initStart={start}
        initEnd={end}
      />

      <AddFab onClick={handleClickOpen} />
    </>
  );
}
