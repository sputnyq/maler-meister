import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Box, Button, Card, CardContent, CardHeader, Chip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo, useRef, useState } from 'react';

import { RequestDailyViewButton } from '../../components/RequestDailyViewButton';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { FilterWrapperCard } from '../../components/filters/FilterWrapperCard';
import { loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getJobColor } from '../../utilities';
import { DailyEntryViewDialog } from '../time-capture/DailyEntryViewDialog';
import { PastDateRange } from '../time-capture/PastDateRange';
import { HoursOverviewCard, HoursType } from './HoursOverviewCard';
import { downloadAsCsv } from './csv/csv-export-utils';
import DailyEntryTypeFilter from './filters/DailyEntryTypeFilter';
import WorkerNameFilter from './filters/WorkerNameFilter';

import { DateRange } from 'mui-daterange-picker-orient';

export default function DailyTimesView() {
  const user = useCurrentUser();

  const [data, setData] = useState<DailyEntry[]>([]);

  const [curUsername, setCurUsername] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [dailyEntryType, setDailyEntryType] = useState<DailyEntryType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const dailyEntryId = useRef('');

  const handleDialogRequest = useCallback((id: any) => {
    dailyEntryId.current = id;
    setDialogOpen(true);
  }, []);

  const columns = useMemo(() => {
    const cols: GridColDef[] = [
      {
        field: 'date',
        width: 250,
        headerName: 'Datum',
        renderCell({ value, id }) {
          return <RequestDailyViewButton value={value} onClick={() => handleDialogRequest(id)} />;
        },
      },
      {
        field: 'type',
        headerName: 'Tätigkeit',
        flex: 1,
        renderCell({ value, row }) {
          return <Chip size="small" label={value} color={getJobColor(row.type)} />;
        },
      },
      {
        field: 'username',
        headerName: 'Mitarbeiter',
      },
      {
        field: 'sum',
        headerName: 'Stunden',
      },
      {
        width: 250,
        field: 'overload',
        headerName: 'Überstunden',
      },
    ];

    return cols;
  }, [handleDialogRequest]);

  const reset = () => {
    setCurUsername('');
    setDateRange({});
    setDailyEntryType(undefined);
  };

  const hours = useMemo(() => {
    let sum = 0;
    let underload = 0;
    let overload = 0;
    let vacations = 0;
    let illness = 0;
    let school = 0;

    data.forEach((dailyEntry) => {
      sum += dailyEntry.sum;
      underload += dailyEntry.underload;
      overload += dailyEntry.overload;
      if (dailyEntry.type === 'Urlaub') {
        vacations += 1;
      }
      if (dailyEntry.type === 'Krank') {
        illness += dailyEntry.sum;
      }
      if (dailyEntry.type === 'Schule') {
        school += 1;
      }
    });

    return [
      {
        amount: sum,
        title: 'Gesamt (Std.)',
      },
      {
        amount: overload,
        title: 'Überstunden (Std.)',
      },
      {
        amount: underload,
        title: 'Unterstunden (Std.)',
      },
      {
        amount: vacations,
        title: 'Urlaub (Tag)',
      },
      {
        amount: illness,
        title: 'Krankheit (Std)',
      },
      {
        amount: school,
        title: 'Schule (Tag)',
      },
    ] as HoursType[];
  }, [data]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleExportRequest = useCallback(() => {
    const { startDate, endDate } = dateRange;
    const fileName = `${curUsername} ${startDate?.toLocaleDateString('ru')}-${endDate?.toLocaleDateString('ru')}`;

    downloadAsCsv(data, fileName);
  }, [data, curUsername, dateRange]);

  const handleSearchRequest = () => {
    const queryObj = {
      filters: {
        tenant: user?.tenant,
        type: dailyEntryType,
        username: curUsername === '' ? undefined : curUsername,
        date: {
          $gte: dateRange.startDate,
          $lte: dateRange.endDate,
        },
      },
      sort: { '0': 'date:desc' },
    };

    setLoading(true);

    loadDailyEntries(queryObj)
      .then(setData)
      .finally(() => {
        setLoading(false);
      });
  };

  const exportDisabled = !(dateRange.endDate && dateRange.startDate && curUsername && data.length > 0);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterWrapperCard onReset={reset} onSearch={handleSearchRequest}>
          <PastDateRange dateRange={dateRange} setDateRange={setDateRange} />
          <WorkerNameFilter curUsername={curUsername} setUsername={setCurUsername} />
          <DailyEntryTypeFilter setType={setDailyEntryType} type={dailyEntryType} />
        </FilterWrapperCard>

        <HoursOverviewCard hours={hours} />

        <Card>
          <CardHeader
            title={
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5">Ergebnisse</Typography>
                <Button
                  disabled={exportDisabled}
                  onClick={handleExportRequest}
                  startIcon={<FileDownloadOutlinedIcon />}
                >
                  Export
                </Button>
              </Box>
            }
          />

          <CardContent>
            <AppDataGrid loading={loading} disablePagination data={data} columns={columns} />
          </CardContent>
        </Card>
      </Box>

      <DailyEntryViewDialog closeDialog={closeDialog} dailyEntryId={dailyEntryId.current} dialogOpen={dialogOpen} />
    </>
  );
}
