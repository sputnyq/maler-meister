import { Box, Button } from '@mui/material';

import { useMemo, useState } from 'react';

import { useIsSmall } from '../../hooks/useIsSmall';
import { AppDialog } from '../AppDialog';

import { formatISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { DateRangePicker, DefinedRange } from 'mui-daterange-picker-orient';

interface Props {
  dateRange: AppDateTange;
  setDateRange(dateRange: AppDateTange): void;
  definedRanges: DefinedRange[];
}

export function DateRangeWidget({ dateRange, setDateRange, definedRanges }: Props) {
  const [open, setOpen] = useState(false);

  const isSmall = useIsSmall();

  const toggle = () => setOpen(!open);

  const handleClose = () => setOpen(false);

  const formatDate = (asString: string) => {
    return new Date(asString).toLocaleDateString('ru');
  };

  const title = useMemo(() => {
    if (dateRange.end && dateRange.start) {
      return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
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
            initialDateRange={{
              startDate: new Date(dateRange.start || new Date()),
              endDate: new Date(dateRange.end || new Date()),
            }}
            verticalOrientation={isSmall}
            definedRanges={definedRanges}
            locale={de}
            open={open}
            toggle={toggle}
            onChange={({ endDate, startDate }) => {
              if (startDate && endDate) {
                setDateRange({
                  start: formatISO(startDate, { representation: 'date' }),
                  end: formatISO(endDate, { representation: 'date' }),
                });
              }
            }}
          />
        </Box>
      </AppDialog>
      <Button sx={{ height: 40 }} fullWidth variant="outlined" disableElevation onClick={toggle}>
        {title}
      </Button>
    </>
  );
}
