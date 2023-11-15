import { Theme, useTheme } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import { useEffect, useRef, useState } from 'react';

import { loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useHolidays } from '../../hooks/useHolidays';
import { dailyEntriesSignal, eventDateRangeSignal } from '../../signals';
import { getColorHex } from '../../utilities';
import { holidays2Events } from '../../utilities/cal-functions';
import { DailyEntryViewDialog } from './DailyEntryViewDialog';

import { EventClickArg, EventInput } from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';
import { formatISO } from 'date-fns';

export function WorkerTimes() {
  const [curYear, setCurYear] = useState(new Date().getFullYear());

  const [dialogOpen, setDialogOpen] = useState(false);

  const holidays = useHolidays(curYear);

  const user = useCurrentUser();
  const theme = useTheme();

  const dailyEntryId = useRef(-1);

  const eventDateRange = eventDateRangeSignal.value;

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
          $lte: formatISO(eventDateRange.end || new Date(), { representation: 'date' }),
        },
      },
      pagination: {
        pageSize: 100,
      },
    };
    loadDailyEntries(queryObj).then((res) => {
      if (res) {
        dailyEntriesSignal.value = res.dailyEntries;
      }
    });
  }, [eventDateRange, user]);

  const holidayEvents = holidays2Events(holidays);
  const deEvents = dailyEntriesSignal.value.map((de) => dailyEntry2Event(de, theme));

  const handleEventClick = (arg: EventClickArg) => {
    const ext = arg.event.extendedProps as EventExtendedProps;
    dailyEntryId.current = ext.id;
    setDialogOpen(true);
  };

  const handleCloseRequest = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <DailyEntryViewDialog
        closeDialog={handleCloseRequest}
        dailyEntryId={dailyEntryId.current}
        dialogOpen={dialogOpen}
      />
      <FullCalendar
        datesSet={(params) => {
          eventDateRangeSignal.value = { end: params.end, start: params.start };
        }}
        events={[...holidayEvents, ...deEvents]}
        locale={deLocale}
        height="510px"
        eventClick={handleEventClick}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        showNonCurrentDates={false}
        titleFormat={{ month: 'short', year: '2-digit' }}
      />
    </>
  );
}

type EventExtendedProps = {
  id: number;
};

function dailyEntry2Event(de: DailyEntry, theme: Theme) {
  return {
    color: getColorHex(de.type, theme),
    date: de.date,
    title: String(de.sum),
    extendedProps: {
      id: de.id,
    },
  } as EventInput;
}
