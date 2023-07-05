import CheckIcon from '@mui/icons-material/CheckOutlined';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';

import React from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  onClose(): void;
  title?: string;
  showConfirm?: boolean;
  onConfirm?: () => void;
}

export function AppFullScreenDialog({
  children,
  open,
  title,
  showConfirm = true,
  onClose,
  onConfirm,
}: React.PropsWithChildren<Props>) {
  return (
    <div>
      <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            {showConfirm && (
              <IconButton onClick={onConfirm} color="inherit">
                <CheckIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        {children}
      </Dialog>
    </div>
  );
}
