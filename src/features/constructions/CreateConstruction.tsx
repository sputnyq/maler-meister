import { useState } from 'react';

import AddFab from '../../components/aa-shared/AddFab';
import EditConstructionDialog from './EditConstructionDialog';

import { addDays } from 'date-fns';

export default function CreateConstruction() {
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
