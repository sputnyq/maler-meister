import FullCalendar from '@fullcalendar/react';
import { useState } from 'react';

import { useHolidays } from '../../hooks/useHolidays';

import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function TimeCalendar() {
  const [curYear, setCurYear] = useState(new Date().getFullYear());
  const holidays = useHolidays(2023);

  return (
    <FullCalendar
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
