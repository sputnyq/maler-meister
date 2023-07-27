import CheckIcon from '@mui/icons-material/CheckOutlined';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Button, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';

import React from 'react';

import { useIsSmall } from '../hooks/useIsSmall';

interface Props {
  open: boolean;
  onClose(): void;
  title?: string;
  showConfirm?: boolean;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
}

export function AppDialog(props: React.PropsWithChildren<Props>) {
  const isSmall = useIsSmall();
  return isSmall ? <MobileDialog {...props} /> : <DesktopDialog {...props} />;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MobileDialog({
  children,
  open,
  title,
  showConfirm = true,
  onClose,
  onConfirm,
  confirmDisabled,
}: React.PropsWithChildren<Props>) {
  return (
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
            <IconButton disabled={confirmDisabled} onClick={onConfirm} color="inherit">
              <CheckIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
}

function DesktopDialog({
  children,
  open,
  title,
  showConfirm = true,
  onClose,
  onConfirm,
  confirmDisabled,
}: React.PropsWithChildren<Props>) {
  const theme = useTheme();
  return (
    <Dialog maxWidth={'md'} fullWidth={true} open={open} onClose={onClose}>
      <DialogTitle color={'white'} sx={{ background: theme.palette.primary.main }}>
        <Box display={'flex'} alignItems="center">
          <Typography variant="h6" flexGrow={1}>
            {title}
          </Typography>
          <IconButton color={'inherit'} onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {showConfirm && (
        <DialogActions>
          <Button disabled={confirmDisabled} variant="contained" disableElevation onClick={onConfirm}>
            OK
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
