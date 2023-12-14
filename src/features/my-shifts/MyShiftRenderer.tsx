import { Box, Typography } from '@mui/material';

import { MyConstructionPlanRenderer } from './MyConstructionPlanRenderer';

interface Props {
  shift: Shift;
}

const formatter = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });

export function MyShiftRenderer({ shift }: Readonly<Props>) {
  const { start, end, constructionsPlan } = shift;

  return (
    <Box>
      <>
        <Typography color="primary" variant="h6">
          {formatter.formatRange(new Date(start), new Date(end))}
        </Typography>
        {constructionsPlan.map((cp) => (
          <MyConstructionPlanRenderer key={cp.id} constructionPlan={cp} />
        ))}
      </>
    </Box>
  );
}
