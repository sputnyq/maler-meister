import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { Badge, Divider, IconButton, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';

interface Props {
  unsavedChanges: boolean;
  onSave(): void;
  onCopy(): void;
  onDownload(): void;
  onDelete(): void;
}

export default function DocumentActions({ onCopy, onDelete, onDownload, onSave, unsavedChanges }: Props) {
  const color = unsavedChanges ? 'error' : 'default';

  const handleDelete = () => {
    if (window.confirm('Möchtest du diese Datei wirklich löschen?')) {
      onDelete();
    }
  };
  return (
    <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
      <Tooltip title="Speichern">
        <IconButton onClick={onSave}>
          <Badge color={color} variant="dot">
            <SaveIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Kopieren">
        <IconButton onClick={onCopy}>
          <FileCopyIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Als PDF speichern">
        <IconButton onClick={onDownload}>
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Löschen">
        <IconButton onClick={handleDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
