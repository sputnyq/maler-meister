import { addMonths, addYears, endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';
import { DefinedRange } from 'mui-daterange-picker-orient';

export const getDateRanges = (): DefinedRange[] => {
  const date = new Date();

  return [
    {
      label: 'Laufender Monat',
      startDate: startOfMonth(date),
      endDate: endOfMonth(date),
    },
    {
      label: 'Letzter Monat',
      startDate: startOfMonth(addMonths(date, -1)),
      endDate: endOfMonth(addMonths(date, -1)),
    },
    {
      label: 'Laufendes Jahr',
      startDate: startOfYear(date),
      endDate: endOfYear(date),
    },
    {
      label: 'Letztes Jahr',
      startDate: startOfYear(addYears(date, -1)),
      endDate: endOfYear(addYears(date, -1)),
    },
  ];
};
