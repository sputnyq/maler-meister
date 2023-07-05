import { MenuItem } from '@mui/material';

import { AppTextField } from '../../../components/aa-shared/AppTextField';
import { useUsernames } from '../../../hooks/useUsernames';
import FilterGridItem from './FilterGridItem';

interface Props {
  curUsername: string;
  setUsername(username: string): void;
}

export default function UserNameFilter({ curUsername, setUsername }: Props) {
  const userNames = useUsernames();
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
        <MenuItem value={''}>-</MenuItem>
        {userNames.map((username, index) => {
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
