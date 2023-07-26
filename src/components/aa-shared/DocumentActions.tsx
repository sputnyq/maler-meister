import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { Badge, Divider, IconButton, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';

interface Props {
  unsavedChanges: boolean;
  onSave?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  isDraft: boolean;
}

export default function DocumentActions({ isDraft, onCopy, onDelete, onDownload, onSave, unsavedChanges }: Props) {
  const color = unsavedChanges ? 'error' : 'default';

  const handleDelete = () => {
    if (window.confirm('Möchtest du diese Datei wirklich löschen?')) {
      onDelete?.();
    }
  };
  return (
    <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
      <Tooltip title="Speichern">
        <IconButton color="inherit" onClick={onSave}>
          <Badge color={color} variant="dot">
            <SaveIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Kopieren">
        <IconButton disabled={isDraft || unsavedChanges} color="inherit" onClick={onCopy}>
          <FileCopyIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Als PDF speichern">
        <IconButton disabled={isDraft || unsavedChanges} color="inherit" onClick={onDownload}>
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Löschen">
        <IconButton disabled={isDraft} onClick={handleDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
