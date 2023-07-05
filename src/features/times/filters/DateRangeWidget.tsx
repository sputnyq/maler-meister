import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { useMemo, useState } from 'react';

import FilterGridItem from './FilterGridItem';

import { addMonths, addYears, endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';
import { de } from 'date-fns/locale';
import { DateRange, DateRangePicker, DefinedRange } from 'mui-daterange-picker-orient';

interface Props {
  dateRange: DateRange;
  setDateRange(dateRange: DateRange): void;
}

export function DateRangeWidget({ dateRange, setDateRange }: Props) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const definedRanges = getDateRanges();

  const title = useMemo(() => {
    if (dateRange.endDate && dateRange.startDate) {
      return `${dateRange.startDate?.toLocaleDateString('ru') || ''} - ${
        dateRange.endDate?.toLocaleDateString('ru') || ''
      }`;
    }
    return 'Zeitraum auswählen';
  }, [dateRange]);

  return (
    <>
      <Dialog maxWidth={'md'} fullWidth={true} open={open}>
        <DialogTitle>Zeiraum auswählen</DialogTitle>
        <DialogContent
          sx={{
            '& .MuiPaper-root': {
              boxShadow: 'none',
            },
            '& .MuiList-root': {
              height: '100%',
            },
            paddingBottom: 0,
            borderTop: '1px solid #ededed',
            borderBottom: '1px solid #ededed',
            '& hr': {
              display: 'none',
            },
          }}
        >
          <DateRangePicker
            definedRanges={definedRanges}
            locale={de}
            open={open}
            toggle={toggle}
            onChange={setDateRange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      <FilterGridItem>
        <Button sx={{ height: 40 }} fullWidth variant="outlined" disableElevation onClick={toggle}>
          {title}
        </Button>
      </FilterGridItem>
    </>
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
