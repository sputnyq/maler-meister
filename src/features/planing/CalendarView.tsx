import { Box, Card, CardContent, Typography } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import { useMemo } from 'react';

import { useHolidays } from '../../hooks/useHolidays';

import { EventSourceInput } from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';

export default function CalendarView() {
  const holidays = useHolidays('2023');

  const events = useMemo(() => {
    const hols = holidays2Events(holidays);

    return [
      ...hols,
      {
        startParam: '2023-08-10',
        endParam: '2023-08-20',
        title: 'Baustelle 1',
      },
      {
        backgroundColor: '#b8d4f3',
        borderColor: 'transparent',
        textColor: 'blue',
        start: '2023-08-14',
        end: '2023-08-19',
        title: `[Urlaub] Dima Ivanov`,
      },
      {
        backgroundColor: 'red',
        borderColor: 'transparent',
        textColor: 'white',
        start: '2023-08-07',
        end: '2023-08-19',
        title: `[6 Personen] Albrechtstr. 12`,
      },
      {
        backgroundColor: 'orange',
        borderColor: 'transparent',
        textColor: 'white',
        start: '2023-08-16',
        end: '2023-08-25',
        title: `[8 Personen] Marienstr. 12`,
      },
      {
        backgroundColor: 'transparent',
        borderColor: 'purple',
        textColor: 'purple',
        start: '2023-08-28',
        end: '2023-09-10',
        title: `?? [7 Personen] Karlsplatz. 34`,
      },
    ];
  }, [holidays]);
  return (
    <Card>
      <CardContent>
        <FullCalendar
          events={events}
          height={'calc(100vh - 150px)'}
          datesSet={(params) => {
            console.log(params);
          }}
          headerToolbar={{
            center: 'zoomIn',
          }}
          customButtons={{
            zoomIn: {
              text: 'Zoom IN',
              click: function () {
                alert('clicked custom button 1!');
              },
            },
          }}
          locale={deLocale}
          plugins={[multiMonthPlugin]}
          multiMonthMaxColumns={1}
          initialView="multiMonthYear"
          //   eventContent={function (arg) {
          //     return (
          //       <Box>
          //         <Typography sx={{ whiteSpace: 'break-spaces', fontSize: '12px' }}>{arg.event.title}</Typography>
          //       </Box>
          //     );
          //   }}
        />
      </CardContent>
    </Card>
  );
}

function holidays2Events(holidays: Feiertag[]): EventSourceInput[] {
  return holidays.map((h) => ({
    backgroundColor: 'white',
    borderColor: 'transparent',
    textColor: 'green',
    date: h.date,
    title: `[Feiertag] ${h.fname}`,
    description: h.comment,
  }));
}
