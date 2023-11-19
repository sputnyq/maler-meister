import { EventInput } from '@fullcalendar/core';

export function holidays2Events(holidays: Feiertag[]): EventInput[] {
  const eventInputs = new Array<EventInput>();

  for (const h of holidays) {
    if (h.fname.toUpperCase() === 'AUGSBURGER FRIEDENSFEST') {
      // not relevant
      continue;
    }

    eventInputs.push({
      display: 'background',
      date: h.date,
      color: 'red',
      allDay: true,
      title: `${h.fname}`,
      extendedProps: {
        type: 'HOLIDAY',
      },
    });
  }
  return eventInputs;
}
