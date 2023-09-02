import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { Badge, Divider, IconButton, ListItemIcon, Menu, MenuItem, MenuList, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';

import { useState } from 'react';

import { useIsSmall } from '../hooks/useIsSmall';

interface Props {
  unsavedChanges: boolean;
  onSave?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  isDraft: boolean;
}

export default function DocumentActions({ isDraft, onCopy, onDelete, onDownload, onSave, unsavedChanges }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isSmall = useIsSmall();

  const color = unsavedChanges ? 'error' : 'default';

  const handleDelete = () => {
    if (window.confirm('Möchtest du diese Datei wirklich löschen?')) {
      onDelete?.();
    }
  };

  const disabled = isDraft || unsavedChanges;

  const DownloadButton = () => (
    <IconButton disabled={disabled} color="inherit" onClick={onDownload}>
      <FileDownloadIcon />
    </IconButton>
  );

  const DeleteButton = () => (
    <IconButton disabled={isDraft} onClick={handleDelete} color="error">
      <DeleteIcon />
    </IconButton>
  );

  const CopyButton = () => (
    <IconButton disabled={disabled} color="inherit" onClick={onCopy}>
      <FileCopyIcon />
    </IconButton>
  );

  const onItemClick = (cb?: () => void) => {
    return function () {
      cb?.();
      handleClose();
    };
  };
  if (isSmall) {
    return (
      <>
        <IconButton onClick={handleClick} id="doc-menu-button" color="inherit">
          <Badge color={color} variant="dot">
            <MoreVertOutlinedIcon />
          </Badge>
        </IconButton>

        <Menu
          id="doc-menu"
          aria-labelledby="doc-menu-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList>
            <MenuItem onClick={onItemClick(onSave)}>
              <ListItemIcon>
                <SaveIcon />
              </ListItemIcon>
              Speichern
            </MenuItem>
            <MenuItem disabled={disabled} onClick={onItemClick(onCopy)}>
              <ListItemIcon>
                <FileCopyIcon />
              </ListItemIcon>
              Kopieren
            </MenuItem>
            <MenuItem disabled={disabled} onClick={onItemClick(onDownload)}>
              <ListItemIcon>
                <FileDownloadIcon />
              </ListItemIcon>
              Als PDF speichern
            </MenuItem>
            <MenuItem onClick={onItemClick(handleDelete)}>
              <ListItemIcon>
                <DeleteIcon color="error" />
              </ListItemIcon>
              Löschen
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  }
  return (
    <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
      <Tooltip title="Speichern">
        <IconButton color="inherit" onClick={onSave}>
          <Badge color={color} variant="dot">
            <SaveIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {disabled ? CopyButton() : <Tooltip title="Kopieren">{CopyButton()}</Tooltip>}

      {disabled ? DownloadButton() : <Tooltip title="Als PDF speichern">{DownloadButton()}</Tooltip>}

      {isDraft ? DeleteButton() : <Tooltip title="Löschen">{DeleteButton()}</Tooltip>}
    </Stack>
  );
}
