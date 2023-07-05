import { addMonths, endOfMonth, startOfMonth } from 'date-fns';
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
  ];
};
