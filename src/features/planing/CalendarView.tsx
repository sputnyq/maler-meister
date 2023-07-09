import { Card, CardContent } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import { useEffect, useMemo, useState } from 'react';

import { loadDailyEntries } from '../../fetch/api';
import { useHolidays } from '../../hooks/useHolidays';
import { useIsSmall } from '../../hooks/useIsSmall';
import { useLoadUsers } from '../../hooks/useLoadUsers';
import { buildQuery } from '../../utils';

import { EventSourceInput } from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';

type EventDateRange = {
  start?: Date;
  end?: Date;
};

export default function CalendarView() {
  const [curYear, setCurYear] = useState(new Date().getFullYear());

  const [multiMonthMaxColumns, setMultiMonthMaxColumns] = useState(1);
  const [currentEvent, setCurrentEvent] = useState<EventDateRange>({});
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);

  const users = useLoadUsers();
  const holidays = useHolidays(curYear);

  const small = useIsSmall();

  useEffect(() => {
    const newYear = currentEvent.start?.getFullYear();
    newYear && setCurYear(newYear);
  }, [currentEvent]);

  useEffect(() => {
    const query = buildQuery({
      filters: {
        type: 'Urlaub',

        date: {
          $gte: currentEvent.start,
          $lte: currentEvent.end,
        },
      },
    });
    loadDailyEntries(query).then((data) => setDailyEntries(data));
  }, [currentEvent]);

  const events = useMemo(() => {
    const hols = holidays2Events(holidays);
    const vacations = dailyEntries2Event(dailyEntries, users);

    return [...hols, ...vacations];
  }, [holidays, dailyEntries, users]);

  const customButtons = useMemo(() => {
    const zoomIn = () => {
      setMultiMonthMaxColumns((cur) => Math.min(cur + 1, 3));
    };

    const zoomOut = () => {
      setMultiMonthMaxColumns((cur) => Math.max(cur - 1, 1));
    };
    return small
      ? undefined
      : {
          plus: {
            text: 'Vergrößern',
            click: zoomOut,
          },
          minus: {
            text: 'Verkleinern',

            click: zoomIn,
          },
        };
  }, [small]);

  const headerToolbar = useMemo(() => {
    return {
      left: 'prev,next today',
      center: small ? undefined : 'title',
      right: small ? 'multiMonthYear,timeGridWeek' : 'minus,plus multiMonthYear,timeGridWeek',
    };
  }, [small]);

  return (
    <Card>
      <CardContent>
        <FullCalendar
          events={events}
          height={'calc(100vh - 170px)'}
          datesSet={(params) => {
            setCurrentEvent({ end: params.end, start: params.start });
          }}
          weekNumbers
          headerToolbar={headerToolbar}
          customButtons={customButtons}
          locale={deLocale}
          plugins={[multiMonthPlugin, timeGridPlugin]}
          multiMonthMaxColumns={multiMonthMaxColumns}
          initialView="multiMonthYear"
        />
      </CardContent>
    </Card>
  );
}

function dailyEntries2Event(dailyEntries: DailyEntry[], users: User[]): EventSourceInput[] {
  return dailyEntries.map((de) => {
    const name = users.find((u) => u.username === de.username)?.lastName || de.username;
    return {
      date: de.date,
      title: `🏝️ ${name}`,
      color: '#19BEC3',
      textColor: 'white',
    };
  });
}

function holidays2Events(holidays: Feiertag[]): EventSourceInput[] {
  const arr = new Array<EventSourceInput>();

  for (const h of holidays) {
    if (h.fname.toUpperCase() === 'AUGSBURGER FRIEDENSFEST') {
      // not relevant
      continue;
    }

    arr.push({
      borderColor: 'transparent',
      backgroundColor: 'green',
      textColor: 'white',
      //@ts-ignore
      date: h.date,
      title: `🎉 ${h.fname}`,
    });
  }
  return arr;
}
