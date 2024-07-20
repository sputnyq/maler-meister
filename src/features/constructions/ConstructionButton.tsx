import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { IconButton, IconButtonProps } from '@mui/material';

import { useState } from 'react';

import EditConstructionDialog from './EditConstructionDialog';

interface Props {
  constructionId?: string | number;
}

export default function ConstructionButton(props: Readonly<Props & IconButtonProps>) {
  const [open, setOpen] = useState(false);

  const { constructionId } = props;
  if (!constructionId) return null;

  return (
    <>
      <EditConstructionDialog
        constructionId={constructionId}
        dialogOpen={open}
        onClose={() => setOpen(false)}
      />
      <IconButton
        {...props}
        onClick={() => {
          setOpen(true);
        }}
      >
        <OpenInNewOutlinedIcon />
      </IconButton>
    </>
  );
}
