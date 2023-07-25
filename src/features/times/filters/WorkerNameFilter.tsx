import { MenuItem } from '@mui/material';

import { AppGridField } from '../../../components/AppGridField';
import { AppTextField } from '../../../components/aa-shared/AppTextField';
import { useLoadUsers } from '../../../hooks/useLoadUsers';

interface Props {
  curUsername: string;
  setUsername(username: string): void;
}

export default function WorkerNameFilter({ curUsername, setUsername }: Props) {
  const allUsers = useLoadUsers();

  const allWorker = allUsers.filter((user) => user.userRole === 'worker');
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
        {allWorker.map((worker, index) => {
          return (
            <MenuItem key={index} value={worker.username}>
              {`${worker.lastName}, ${worker.firstName}`}
            </MenuItem>
          );
        })}
      </AppTextField>
    </AppGridField>
  );
}
