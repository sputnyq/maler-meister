import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import AppGrid from '../../components/aa-shared/AppGrid';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { appRequest } from '../../fetch/fetch-client';
import { genericConverter } from '../../utils';
import { DateRangeWidget } from './DateRangeWidget';
import UserNameFilter from './UserNameFilter';

import { DateRange } from 'mui-daterange-picker-orient';
import qs from 'qs';

export default function DailyTimesView() {
  const [curUsername, setCurUsername] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({});

  const [data, setData] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns = useMemo(() => {
    const cols: GridColDef[] = [
      {
        field: 'date',
        width: 250,
        headerName: 'Datum',
        renderCell({ value, id }) {
          return (
            <Link target={'_blank'} style={{ textDecoration: 'none' }} to={`/daily-entry/${id}`}>
              {new Intl.DateTimeFormat('de-DE', {
                dateStyle: 'full',
              }).format(new Date(value))}
            </Link>
          );
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
  };

  const buildQuery = () => {
    const query = qs.stringify({
      filters: {
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
    const query = buildQuery();
    appRequest('get')(`daily-entries?${query}`)
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

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Card>
        <CardContent>
          <AppGrid>
            <DateRangeWidget dateRange={dateRange} setDateRange={setDateRange} />
            <UserNameFilter curUsername={curUsername} setUsername={setCurUsername} />
          </AppGrid>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={reset} variant="outlined">
              Zurücksetzen
            </Button>
            <Button onClick={handleSearchRequest} variant="contained">
              Suchen
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Ergebnisse"></CardHeader>
        <CardContent>
          <AppDataGrid loading={loading} disablePagination data={data} columns={columns}></AppDataGrid>
        </CardContent>
      </Card>
    </Box>
  );
}
