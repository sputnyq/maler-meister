import { Card, CardContent } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import { useEffect, useMemo, useState } from 'react';

import { loadConstructions, loadDailyEntries } from '../../fetch/api';
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

const COLOR_CODES = ['#5856d6', '#71e2fa', '#0c6378', '#808994', '#ae2c1c', '#0e738a'];

export default function CalendarView() {
  const [curYear, setCurYear] = useState(new Date().getFullYear());

  const [multiMonthMaxColumns, setMultiMonthMaxColumns] = useState(1);
  const [eventRange, setEventRange] = useState<EventDateRange>({});
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [constructions, setConstructions] = useState<Construction[]>([]);

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
        tenant: user?.tenant,
        date: {
          $gte: eventRange.start,
          $lte: eventRange.end,
        },
      },
    };
    loadConstructions(queryObj).then(setConstructions);
  }, [eventRange, user]);

  useEffect(() => {
    const queryObj = {
      filters: {
        type: 'Urlaub',
        tenant: user?.tenant,
        date: {
          $gte: eventRange.start,
          $lte: eventRange.end,
        },
        sort: { '0': 'start:desc' },
      },
    };
    loadDailyEntries(queryObj).then((data) => setDailyEntries(data));
  }, [eventRange, user]);

  const events = useMemo(() => {
    const holidayEvents = holidays2Events(holidays);
    const vacationEvents = dailyEntries2Event(dailyEntries, users);
    const constructionEvents = constructions2Events(constructions);

    return [...holidayEvents, ...vacationEvents, ...constructionEvents];
  }, [holidays, dailyEntries, users, constructions]);

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

function constructions2Events(constructions: Construction[]): EventInput[] {
  return constructions.map((cstr, index) => {
    const curColor = COLOR_CODES[index % COLOR_CODES.length];

    const obj: EventInput = {
      title: `[${cstr.allocatedPersons || ''}] ${cstr.name}`,
      start: cstr.start,
      end: cstr.end,
      textColor: curColor,
      borderColor: curColor,
      backgroundColor: 'white',
    };

    if (cstr.confirmed) {
      return {
        ...obj,
        backgroundColor: curColor,
        textColor: 'white',
      } as EventInput;
    }

    return obj;
  });
}

function dailyEntries2Event(dailyEntries: DailyEntry[], users: User[]): EventInput[] {
  return dailyEntries.map((de) => {
    const name = users.find((u) => u.username === de.username)?.lastName || de.username;
    return {
      date: de.date,
      title: `🏝️ ${name}`,
      color: 'red',
      textColor: 'white',
      allDay: true,
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
      allDay: true,
      title: `🎉 ${h.fname}`,
    });
  }
  return eventInputs;
}
