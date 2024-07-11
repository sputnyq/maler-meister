import { Typography } from '@mui/material';

import { ColFlexBox } from '../../components/ColFlexBox';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function Info() {
  const user = useCurrentUser();
  if (!user) {
    return null;
  }

  const { firstName, lastName, username } = user;

  return (
    <ColFlexBox>
      <Typography>{`Version: ${import.meta.env.PACKAGE_VERSION}`}</Typography>
      <Typography>{`Angemeldet als: ${firstName} ${lastName} (${username})`}</Typography>
    </ColFlexBox>
  );
}
