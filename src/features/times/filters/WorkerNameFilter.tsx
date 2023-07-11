import { MenuItem } from '@mui/material';

import { AppTextField } from '../../../components/aa-shared/AppTextField';
import FilterGridItem from '../../../components/filters/FilterGridItem';
import { useLoadUsers } from '../../../hooks/useLoadUsers';

interface Props {
  curUsername: string;
  setUsername(username: string): void;
}

export default function WorkerNameFilter({ curUsername, setUsername }: Props) {
  const allUsers = useLoadUsers();

  const allWorker = allUsers.filter((user) => user.userRole === 'worker');
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
        {allWorker.map((worker, index) => {
          return (
            <MenuItem key={index} value={worker.username}>
              {`${worker.firstName} ${worker.lastName}`}
            </MenuItem>
          );
        })}
      </AppTextField>
    </FilterGridItem>
  );
}
