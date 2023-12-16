import FullCalendar from '@fullcalendar/react';
import { useRef, useState } from 'react';

import { DailyEntryViewDialog } from './DailyEntryViewDialog';

import { EventClickArg, EventInput } from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';

interface Props {
  eventDateRange: EventDateRange;
  setEventDateRange: (edr: EventDateRange) => void;
  events: EventInput[];
  requestUpdate(): void;
}

export function WorkerTimes({ setEventDateRange, events, requestUpdate }: Readonly<Props>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const dailyEntryId = useRef<number | undefined>(undefined);

  const handleEventClick = (arg: EventClickArg) => {
    const ext = arg.event.extendedProps as EventExtendedProps;
    if (ext.type === 'DAILY_ENTRY') {
      dailyEntryId.current = ext.id;
      setDialogOpen(true);
    }
  };

  const handleCloseRequest = () => {
    setDialogOpen(false);
    requestUpdate();
  };

  return (
    <>
      <DailyEntryViewDialog
        closeDialog={handleCloseRequest}
        dailyEntryId={dailyEntryId.current}
        dialogOpen={dialogOpen}
      />
      <FullCalendar
        datesSet={setEventDateRange}
        events={events}
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
  type: 'DAILY_ENTRY' | 'HOLIDAY';
};
