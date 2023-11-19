export const HOLIDAY_OBSERVER = 42;
// import { DEFAULT_HOURS } from '../../constants';
// import { appRequest } from '../../fetch/fetch-client';
// import { useCurrentUser } from '../../hooks/useCurrentUser';
// import { useHolidays } from '../../hooks/useHolidays';
// import { dailyEntriesSignal, eventDateRangeSignal } from '../../signals';
// import { genericConverter, isWeekend } from '../../utilities';
// import { isEntryExists } from './time-capture-flow/timeCaptureUtils';

// import { isAfter, isBefore } from 'date-fns';

// export function HolidaysObserver() {
//   const user = useCurrentUser();
//   const holidays = useHolidays(eventDateRangeSignal.value.start?.getFullYear());

//   if (!user) {
//     return null;
//   }

//   const { start, end } = eventDateRangeSignal.value;

//   const { tenant, username } = user;
//   if (start && end) {
//     const holidaysInMonth = holidays.filter((h) => {
//       const date = new Date(h.date);
//       return isAfter(date, start) && isBefore(date, end);
//     });

//     const nonWeekEndHolidays = holidaysInMonth.filter((h) => {
//       const date = new Date(h.date);
//       return !isWeekend(date);
//     });

//     nonWeekEndHolidays.forEach(async (h) => {
//       const exist = await isEntryExists({ username, date: h.date, tenant });
//       if (!exist && confirm('Feiertage eintragen?')) {
//         const dailyEntry: DailyEntry = {
//           date: h.date,
//           sum: DEFAULT_HOURS,
//           overload: 0,
//           tenant,
//           username,
//           type: 'Feiertag',
//         };
//         await appRequest('post')('daily-entries', { data: dailyEntry }).then((res) => {
//           const converted = genericConverter<DailyEntry>(res.data);
//           dailyEntriesSignal.value = [...dailyEntriesSignal.value, converted];
//         });
//       }
//     });
//   }

//   return null;
// }
