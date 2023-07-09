import { Card, CardContent } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import { useEffect, useMemo, useState } from 'react';

import { loadDailyEntries } from '../../fetch/api';
import { useHolidays } from '../../hooks/useHolidays';
import { useIsSmall } from '../../hooks/useIsSmall';
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
    const vacations = dailyEntries2Event(dailyEntries);

    return [...hols, ...vacations];
  }, [holidays, dailyEntries]);

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

function dailyEntries2Event(dailyEntries: DailyEntry[]): EventSourceInput[] {
  return dailyEntries.map((de) => {
    return {
      date: de.date,
      title: `Urlaub ${de.username}`,
      color: 'blue',
      textColor: 'white',
    };
  });
}

function holidays2Events(holidays: Feiertag[]): EventSourceInput[] {
  return holidays.map((h) => {
    const obj = {
      date: h.date,
      title: h.fname,
      description: h.comment,
      borderColor: 'green',
    };
    if (h.comment) {
      return {
        ...obj,
        backgroundColor: 'white',
        textColor: 'green',
      };
    } else {
      return {
        ...obj,
        backgroundColor: 'green',
        textColor: 'white',
      };
    }
  });
}
