import { MenuItem } from '@mui/material';

import { AppTextField } from '../../../components/aa-shared/AppTextField';
import { useLoadUsers } from '../../../hooks/useLoadUsers';
import FilterGridItem from './FilterGridItem';

interface Props {
  curUsername: string;
  setUsername(username: string): void;
}

export default function WorkerNameFilter({ curUsername, setUsername }: Props) {
  const allUsers = useLoadUsers();

  const workerUserNames = allUsers.filter((user) => user.userRole === 'worker').map((user) => user.username);
  return (
    <FilterGridItem>
      <AppTextField
        value={curUsername}
        onChange={(ev) => {
          setUsername(ev.target.value);
        }}
        select
        label="Mitarbeiter"
      >
        <MenuItem value={undefined}>-</MenuItem>
        {workerUserNames.map((username, index) => {
          return (
            <MenuItem key={index} value={username}>
              {username}
            </MenuItem>
          );
        })}
      </AppTextField>
    </FilterGridItem>
  );
}
