import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { useState } from 'react';

import FilterGridItem from './FilterGridItem';
import { getDateRanges } from './dateRangeWiget-utils';

import { de } from 'date-fns/locale';
import { DateRange, DateRangePicker } from 'mui-daterange-picker-orient';

interface Props {
  dateRange: DateRange;
  setDateRange(dateRange: DateRange): void;
}
export function DateRangeWidget({ dateRange, setDateRange }: Props) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const definedRanges = getDateRanges();

  return (
    <>
      <Dialog maxWidth={'md'} fullWidth={true} open={open}>
        <DialogTitle>Zeiraum auswählen</DialogTitle>
        <DialogContent
          sx={{
            '&  .MuiPaper-root': {
              boxShadow: 'none',
            },
            '&  .MuiList-root': {
              height: '100%',
            },
            paddingBottom: 0,
            borderTop: '1px solid #ededed',
            borderBottom: '1px solid #ededed',
            ' & hr': {
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
          <Button onClick={() => setOpen(false)}>Schließen</Button>
        </DialogActions>
      </Dialog>

      <FilterGridItem>
        <Button sx={{ height: 40 }} fullWidth variant="outlined" disableElevation onClick={toggle}>
          {`Zeitraum ${dateRange.startDate?.toLocaleDateString('ru') || ''} - ${
            dateRange.endDate?.toLocaleDateString('ru') || ''
          }`}
        </Button>
      </FilterGridItem>
    </>
  );
}
