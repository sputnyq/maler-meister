import { Card, CardContent, useTheme } from '@mui/material';

import FullCalendar from '@fullcalendar/react';

import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarView() {
const 

  const theme = useTheme();
  return (
    <Card>
      <CardContent>
        <FullCalendar
          themeSystem="bootstrap4"
          events={[
            {
              start: '2023-07-06',
              end: new Date('2023-07-07').setHours(17),

              title: 'Test',
              allDay: true,
              color: 'red',
            },
            {
              start: new Date(),
              end: '2023-07-10',

              title: 'Test',
              allDay: true,
              color: 'red',
            },
            {
              date: new Date(),
              title: 'Test2',
              allDay: true,
            },
          ]}
          height={'calc(100vh - 200px)'}
          datesSet={(params) => {
            console.log(params);
          }}
          locale={deLocale}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
        />
      </CardContent>
    </Card>
  );
}
