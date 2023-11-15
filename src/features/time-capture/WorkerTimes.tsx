import FullCalendar from '@fullcalendar/react';
import { useEffect, useMemo, useState } from 'react';

import { useHolidays } from '../../hooks/useHolidays';
import { holidays2Events } from '../../utilities/cal-functions';

import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';

export function WorkerTimes() {
  const [curYear, setCurYear] = useState(new Date().getFullYear());
  const [eventRange, setEventRange] = useState<EventDateRange>({});
  const holidays = useHolidays(curYear);

  useEffect(() => {
    const newYear = eventRange.start?.getFullYear();
    newYear && setCurYear(newYear);
  }, [eventRange]);

  const events = useMemo(() => {
    const holidayEvents = holidays2Events(holidays);
    return [...holidayEvents];
  }, [holidays]);

  return (
    <FullCalendar
      datesSet={(params) => {
        setEventRange({ end: params.end, start: params.start });
      }}
      events={events}
      locale={deLocale}
      height="550px"
      plugins={[dayGridPlugin]}
      multiMonthMaxColumns={1}
      initialView="dayGridMonth"
      showNonCurrentDates={false}
      titleFormat={{ month: 'short', year: '2-digit' }}
    />
  );
}
