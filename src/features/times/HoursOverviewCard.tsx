import { Card, CardContent, Divider, Stack } from '@mui/material';

import HoursTile from './HoursTile';

export type HoursType = {
  title: string;
  amount: number;
};

interface Props {
  hours: HoursType[];
}

export function HoursOverviewCard({ hours }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
          {hours.map((hourObj, index) => (
            <HoursTile {...hourObj} key={index} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
