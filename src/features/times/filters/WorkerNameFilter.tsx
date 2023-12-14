import { MenuItem } from '@mui/material';

import { AppGridField } from '../../../components/AppGridField';
import { AppTextField } from '../../../components/AppTextField';
import { useWorkers } from '../../../hooks/useWorkers';

interface Props {
  curUsername: string;
  setUsername(username: string): void;
}

export default function WorkerNameFilter({ curUsername, setUsername }: Props) {
  const workers = useWorkers();

  return (
    <AppGridField>
      <AppTextField
        value={curUsername}
        onChange={(ev) => {
          setUsername(ev.target.value);
        }}
        select
        label="Mitarbeiter"
      >
        <MenuItem>Alle</MenuItem>
        {workers.map((worker) => {
          return (
            <MenuItem key={worker.username} value={worker.username}>
              {`${worker.lastName}, ${worker.firstName}`}
            </MenuItem>
          );
        })}
      </AppTextField>
    </AppGridField>
  );
}
