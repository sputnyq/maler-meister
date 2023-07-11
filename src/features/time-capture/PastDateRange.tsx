import FilterGridItem from '../../components/filters/FilterGridItem';
import { DateRangeWidget } from '../../components/widgets/DateRangeWidget';

import { addMonths, addYears, endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';
import { DateRange, DefinedRange } from 'mui-daterange-picker-orient';

interface Props {
  dateRange: DateRange;
  setDateRange(dateRange: DateRange): void;
}

export function PastDateRange({ dateRange, setDateRange }: Props) {
  const definedRanges = getDateRanges();

  return (
    <FilterGridItem>
      <DateRangeWidget definedRanges={definedRanges} dateRange={dateRange} setDateRange={setDateRange} />
    </FilterGridItem>
  );
}

function getDateRanges(): DefinedRange[] {
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
}
