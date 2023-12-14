import { Box, Typography } from '@mui/material';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import { MyConstructionPlanRenderer } from './MyConstructionPlanRenderer';

interface Props {
  shift: Shift;
}

const formatter = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });

export function MyShiftRenderer({ shift }: Readonly<Props>) {
  const { start, end, constructionsPlan } = shift;

  const user = useCurrentUser();

  if (!user) {
    return user;
  }

  return (
    <Box>
      <>
        <Typography color="primary" variant="h6">
          {formatter.formatRange(new Date(start), new Date(end))}
        </Typography>
        {constructionsPlan
          .filter((cp) => isMyCp(cp, user.username))
          .map((cp) => (
            <MyConstructionPlanRenderer key={cp.id} constructionPlan={cp} />
          ))}
      </>
    </Box>
  );
}

const isMyCp = (cp: ConstructionPlan, username: string) => cp.usernames.includes(username);
