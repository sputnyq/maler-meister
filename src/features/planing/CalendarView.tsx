import { Card, CardContent } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import { useEffect, useMemo, useState } from 'react';

import { loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useHolidays } from '../../hooks/useHolidays';
import { useIsSmall } from '../../hooks/useIsSmall';
import { useLoadUsers } from '../../hooks/useLoadUsers';

import { EventInput } from '@fullcalendar/core';
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
  const [eventRange, setEventRange] = useState<EventDateRange>({});
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);

  const users = useLoadUsers();

  const user = useCurrentUser();
  const holidays = useHolidays(curYear);

  const small = useIsSmall();

  useEffect(() => {
    const newYear = eventRange.start?.getFullYear();
    newYear && setCurYear(newYear);
  }, [eventRange]);

  useEffect(() => {
    const queryObj = {
      filters: {
        type: 'Urlaub',
        tenant: user?.tenant,
        date: {
          $gte: eventRange.start,
          $lte: eventRange.end,
        },
      },
    };
    loadDailyEntries(queryObj).then((data) => setDailyEntries(data));
  }, [eventRange, user]);

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
            setEventRange({ end: params.end, start: params.start });
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

function dailyEntries2Event(dailyEntries: DailyEntry[], users: User[]): EventInput[] {
  return dailyEntries.map((de) => {
    const name = users.find((u) => u.username === de.username)?.lastName || de.username;
    return {
      date: de.date,
      title: `🏝️ ${name}`,
      color: '#19BEC3',
      textColor: 'white',
    } as EventInput;
  });
}

function holidays2Events(holidays: Feiertag[]): EventInput[] {
  const eventInputs = new Array<EventInput>();

  for (const h of holidays) {
    if (h.fname.toUpperCase() === 'AUGSBURGER FRIEDENSFEST') {
      // not relevant
      continue;
    }

    eventInputs.push({
      borderColor: 'transparent',
      backgroundColor: 'green',
      textColor: 'white',
      date: h.date,
      title: `🎉 ${h.fname}`,
    });
  }
  return eventInputs;
}
