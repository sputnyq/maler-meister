import { Card, CardContent, CardHeader } from '@mui/material';

import { dailyEntriesSignal, eventDateRangeSignal } from '../../signals';
import { formatNumber } from '../../utilities';
import { WorkerTimes } from './WorkerTimes';
import { TimeCaptureFlow } from './time-capture-flow';

import { isAfter, isBefore } from 'date-fns';

export default function TimeCapture() {
  function isInRange(de: DailyEntry) {
    const { start, end } = eventDateRangeSignal.value;

    if (start && end) {
      const date = new Date(de.date);
      return isAfter(date, start) && isBefore(date, end);
    }
    return false;
  }

  const sum = dailyEntriesSignal.value.filter((de) => isInRange(de)).reduce((acc, next) => acc + next.sum, 0);

  return (
    <Card>
      <CardHeader title={`Gesamt: ${formatNumber(sum)} Stunden`} />
      <CardContent>
        <WorkerTimes />
      </CardContent>
      <TimeCaptureFlow />
    </Card>
  );
}
