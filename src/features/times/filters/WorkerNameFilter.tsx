import { MenuItem } from '@mui/material';

import { useSelector } from 'react-redux';

import { AppGridField } from '../../../components/AppGridField';
import { AppTextField } from '../../../components/AppTextField';
import { AppState } from '../../../store';

interface Props {
  curUsername: string;
  setUsername(username: string): void;
}

export default function WorkerNameFilter({ curUsername, setUsername }: Props) {
  const allUsers = useSelector<AppState, User[]>((s) => s.users.all);

  const workers = allUsers.filter((user) => user.userRole === 'worker');
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
