import { Box, Button } from '@mui/material';

import { useMemo, useState } from 'react';

import { useIsSmall } from '../../hooks/useIsSmall';
import { AppDialog } from '../AppDialog';

import { de } from 'date-fns/locale';
import { DateRange, DateRangePicker, DefinedRange } from 'mui-daterange-picker-orient';

interface Props {
  dateRange: DateRange;
  setDateRange(dateRange: DateRange): void;
  definedRanges: DefinedRange[];
}

export function DateRangeWidget({ dateRange, setDateRange, definedRanges }: Props) {
  const [open, setOpen] = useState(false);

  const isSmall = useIsSmall();

  const toggle = () => setOpen(!open);

  const handleClose = () => setOpen(false);

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
      <AppDialog title="Zeitraum auswählen" open={open} onClose={handleClose} onConfirm={handleClose}>
        <Box
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
            initialDateRange={dateRange}
            verticalOrientation={isSmall}
            definedRanges={definedRanges}
            locale={de}
            open={open}
            toggle={toggle}
            onChange={setDateRange}
          />
        </Box>
      </AppDialog>
      <Button sx={{ height: 40 }} fullWidth variant="outlined" disableElevation onClick={toggle}>
        {title}
      </Button>
    </>
  );
}
