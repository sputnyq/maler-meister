import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo, useRef, useState } from 'react';

import RequestDailyViewButton from '../../components/RequestDailyViewButton';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { loadDailyEntries } from '../../fetch/api';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { buildQuery, genericConverter } from '../../utils';
import { DailyEntryView } from '../time-capture/DailyEntryView';
import { HoursOverviewCard, HoursType } from './HoursOverviewCard';
import { downloadAsCsv } from './csv/csv-export-utils';
import DailyEntryTypeFilter from './filters/DailyEntryTypeFilter';
import { DateRangeWidget } from './filters/DateRangeWidget';
import { FilterTile } from './filters/FilterTile';
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
      {
        width: 250,
        field: 'underload',
        headerName: 'Unterstunden',
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

    data.forEach((dailyEntry) => {
      sum += dailyEntry.sum;
      underload += dailyEntry.underload;
      overload += dailyEntry.overload;
      if (dailyEntry.type === 'Urlaub') {
        vacations += 1;
      }
      if (dailyEntry.type === 'Krank') {
        illness += 1;
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
        title: 'Krankheit (Tag)',
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

  const buildSearchQuery = () => {
    const query = buildQuery({
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
    });
    return query;
  };

  const handleSearchRequest = () => {
    setLoading(true);

    loadDailyEntries(buildSearchQuery())
      .then(setData)
      .finally(() => {
        setLoading(false);
      });
  };

  const exportDisabled = !(dateRange.endDate && dateRange.startDate && curUsername && data.length > 0);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterTile onReset={reset} onSearch={handleSearchRequest}>
          <DateRangeWidget dateRange={dateRange} setDateRange={setDateRange} />
          <WorkerNameFilter curUsername={curUsername} setUsername={setCurUsername} />
          <DailyEntryTypeFilter setType={setDailyEntryType} type={dailyEntryType} />
        </FilterTile>

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

      <DailyEntryView closeDialog={closeDialog} dailyEntryId={dailyEntryId.current} dialogOpen={dialogOpen} />
    </>
  );
}
