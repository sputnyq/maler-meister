import { Card, CardContent, Divider, Stack } from '@mui/material';

import { useIsSmall } from '../../hooks/useIsSmall';
import { HoursTile } from './HoursTile';

export type HoursType = {
  title: string;
  amount: number;
};

interface Props {
  hours: HoursType[];
}

export function HoursOverviewCard({ hours }: Props) {
  const small = useIsSmall();

  return (
    <Card>
      <CardContent>
        <Stack
          direction={small ? 'column' : 'row'}
          spacing={1}
          divider={<Divider orientation={small ? 'horizontal' : 'vertical'} flexItem />}
        >
          {hours.map((hourObj) => (
            <HoursTile {...hourObj} key={`${hourObj.amount}-${hourObj.title}`} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
