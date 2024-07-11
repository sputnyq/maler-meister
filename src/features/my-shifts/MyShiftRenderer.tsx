import { Typography } from '@mui/material';

import { Wrapper } from '../../components/Wrapper';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { MyConstructionPlanRenderer } from './MyConstructionPlanRenderer';

interface Props {
  shift: Shift;
}

const formatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: '2-digit',
});

export function MyShiftRenderer({ shift }: Readonly<Props>) {
  const { start, end, constructionsPlan } = shift;

  const user = useCurrentUser();

  if (!user) {
    return user;
  }

  return (
    <Wrapper
      cardProps={{ variant: 'outlined' }}
      title={
        <Typography variant="h6">
          {formatter.formatRange(new Date(start), new Date(end))}
        </Typography>
      }
    >
      {constructionsPlan
        .filter((cp) => isMyCp(cp, user.username))
        .map((cp) => (
          <MyConstructionPlanRenderer key={cp.id} constructionPlan={cp} />
        ))}
    </Wrapper>
  );
}

const isMyCp = (cp: ConstructionPlan, username: string) => cp.usernames.includes(username);
