import { getJobColor, userFullName } from '.';

import { EventInput } from '@fullcalendar/core';

export function dailyEntries2Event(dailyEntries: DailyEntry[], users: User[]): EventInput[] {
  return dailyEntries.map((de) => {
    const user = users.find((u) => u.username === de.username);

    const name = user ? userFullName(user) : de.username;

    return {
      date: de.date,
      title: name,

      //TODO:
      color: '#121212',
      textColor: 'white',
      allDay: true,
      extendedProps: {
        type: 'DAILY_ENTRY',
        id: de.id,
      },
    } as EventInput;
  });
}

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
      allDay: true,
      title: `${h.fname}`,
    });
  }
  return eventInputs;
}
