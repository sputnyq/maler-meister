import { Card, CardContent, CardHeader, Theme, useTheme } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useHolidays } from '../../hooks/useHolidays';
import { formatNumber, getColorHex } from '../../utilities';
import { holidays2Events } from '../../utilities/cal-functions';
import { WorkerTimes } from './WorkerTimes';
import { TimeCaptureFlow } from './time-capture-flow';

import { EventInput } from '@fullcalendar/core';
import { formatISO } from 'date-fns';

export default function TimeCapture() {
  const [curYear, setCurYear] = useState(new Date().getFullYear());
  const [eventDateRange, setEventDateRange] = useState<EventDateRange>({});
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [update, setUpdate] = useState<number>(-1);

  const holidays = useHolidays(curYear);
  const theme = useTheme();
  const user = useCurrentUser();

  useEffect(() => {
    const newYear = eventDateRange.start?.getFullYear();
    newYear && setCurYear(newYear);
  }, [eventDateRange]);

  useEffect(() => {
    const queryObj = {
      filters: {
        tenant: user?.tenant,
        username: user?.username,
        date: {
          $gte: formatISO(eventDateRange.start || new Date(), { representation: 'date' }),
          $lt: formatISO(eventDateRange.end || new Date(), { representation: 'date' }),
        },
      },
      pagination: {
        pageSize: 100,
      },
    };
    loadDailyEntries(queryObj).then((res) => {
      if (res) {
        setDailyEntries(res.dailyEntries);
      }
    });
  }, [eventDateRange, user, update]);

  const holidayEvents = holidays2Events(holidays);
  const deEvents = dailyEntries.map((de) => dailyEntry2Event(de, theme));
  const sum = dailyEntries.reduce((acc, next) => acc + next.sum, 0);

  const requestUpdate = () => {
    setUpdate((u) => u + 1);
  };

  return (
    <Card>
      <CardHeader title={`Gesamt: ${formatNumber(sum)} Stunden`}></CardHeader>
      <CardContent>
        <WorkerTimes
          events={[...holidayEvents, ...deEvents]}
          eventDateRange={eventDateRange}
          setEventDateRange={setEventDateRange}
          requestUpdate={requestUpdate}
        />
      </CardContent>
      <TimeCaptureFlow requestUpdate={requestUpdate} />
    </Card>
  );
}

function dailyEntry2Event(de: DailyEntry, theme: Theme) {
  return {
    color: getColorHex(de.type, theme),
    date: de.date,
    title: formatNumber(de.sum),
    extendedProps: {
      id: de.id,
      type: 'DAILY_ENTRY',
    },
  } as EventInput;
}
