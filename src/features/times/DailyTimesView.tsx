import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useMemo, useRef, useState } from 'react';

import RequestDailyViewButton from '../../components/RequestDailyViewButton';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { appRequest } from '../../fetch/fetch-client';
import { buildQuery, genericConverter } from '../../utils';
import { DailyEntryView } from '../time-capture/DailyEntryView';
import { HoursOverviewCard, HoursType } from './HoursOverviewCard';
import DailyEntryTypeFilter from './filters/DailyEntryTypeFilter';
import { DateRangeWidget } from './filters/DateRangeWidget';
import { FilterTile } from './filters/FilterTile';
import UserNameFilter from './filters/UserNameFilter';

import { DateRange } from 'mui-daterange-picker-orient';

export default function DailyTimesView() {
  const [curUsername, setCurUsername] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [dailyEntryType, setDailyEntryType] = useState<DailyEntryType | undefined>(undefined);
  const [data, setData] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dailyEntryId = useRef('');

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleDialogRequest = (id: any) => {
    dailyEntryId.current = id;
    setDialogOpen(true);
  };

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
  }, []);

  const reset = () => {
    setCurUsername('');
    setDateRange({});
    setDailyEntryType(undefined);
  };

  const buildSearchQuery = () => {
    const query = buildQuery({
      filters: {
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

    appRequest('get')(`daily-entries?${buildSearchQuery()}`)
      .then((res) => {
        const data = res.data.map((e: any) => genericConverter<DailyEntry[]>(e));

        setData(data);
      })
      .catch((e) => {
        console.log(e);
        alert('Fehler beim Laden');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const hours = useMemo(() => {
    let sum = 0;

    let underload = 0;

    let overload = 0;

    let holidays = 0;

    let illness = 0;

    data.forEach((dailyEntry) => {
      sum += dailyEntry.sum;
      underload += dailyEntry.underload;
      overload += dailyEntry.overload;
      if (dailyEntry.type === 'Urlaub') {
        holidays += 1;
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
        amount: holidays,
        title: 'Urlaub (Tag)',
      },
      {
        amount: illness,
        title: 'Krankheit (Tag)',
      },
    ] as HoursType[];
  }, [data]);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterTile onReset={reset} onSearch={handleSearchRequest}>
          <DateRangeWidget dateRange={dateRange} setDateRange={setDateRange} />
          <UserNameFilter curUsername={curUsername} setUsername={setCurUsername} />
          <DailyEntryTypeFilter setType={setDailyEntryType} type={dailyEntryType} />
        </FilterTile>
        <HoursOverviewCard hours={hours} />

        <Card>
          <CardHeader title="Ergebnisse"></CardHeader>
          <CardContent>
            <AppDataGrid loading={loading} disablePagination data={data} columns={columns}></AppDataGrid>
          </CardContent>
        </Card>
      </Box>
      <DailyEntryView closeDialog={closeDialog} dailyEntryId={dailyEntryId.current} dialogOpen={dialogOpen} />
    </>
  );
}
