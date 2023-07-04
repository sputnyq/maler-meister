import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useMemo, useState } from 'react';

import AppGrid from '../../components/aa-shared/AppGrid';
import { AppTextField } from '../../components/aa-shared/AppTextField';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { appRequest } from '../../fetch/fetch-client';
import { genericConverter } from '../../utils';
import ConstructionView from '../time-capture/ConstructionView';
import { DateRangeWidget } from './DateRangeWidget';
import FilterGridItem from './FilterGridItem';
import UserNameFilter from './UserNameFilter';

import { DateRange } from 'mui-daterange-picker-orient';
import * as qs from 'qs';

export default function WorkEntriesTimesView() {
  const [curUsername, setCurUsername] = useState('');
  const [constructionId, setConstructionId] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({});

  const [data, setData] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns = useMemo(() => {
    const cols: GridColDef[] = [
      {
        field: 'date',
        width: 250,
        headerName: 'Datum',
        renderCell({ value }) {
          return new Intl.DateTimeFormat('de-DE', {
            dateStyle: 'full',
          }).format(new Date(value));
        },
      },

      {
        field: 'username',
        headerName: 'Mitarbeiter',
      },
      {
        field: 'hours',
        headerName: 'Stunden',
      },
      {
        field: 'job',
        headerName: 'Tätigkeit',
      },
      {
        field: 'constructionId',
        headerName: 'Baustelle',
        flex: 1,
        renderCell({ value }) {
          return <ConstructionView constructionId={value} />;
        },
      },
    ];

    return cols;
  }, []);

  const reset = () => {
    setCurUsername('');
    setDateRange({});
    setConstructionId('');
  };

  const buildQuery = () => {
    const query = qs.stringify({
      filters: {
        username: curUsername === '' ? undefined : curUsername,
        date: {
          $gte: dateRange.startDate,
          $lte: dateRange.endDate,
        },
        constructionId: constructionId === '' ? undefined : constructionId,
      },
      sort: { '0': 'date:desc' },
    });

    return query;
  };

  const handleSearchRequest = () => {
    setLoading(true);
    const query = buildQuery();
    appRequest('get')(`work-entries?${query}`)
      .then((res) => {
        const data = res.data.map((e: any) => genericConverter<WorkEntry[]>(e));

        setData(data);
      })
      .catch((e) => {
        alert('Fehler beim Laden');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <Card>
          <CardContent>
            <AppGrid>
              <DateRangeWidget dateRange={dateRange} setDateRange={setDateRange} />
              <UserNameFilter curUsername={curUsername} setUsername={setCurUsername} />
              <FilterGridItem>
                <AppTextField
                  value={constructionId}
                  onChange={(ev) => {
                    setConstructionId(ev.target.value);
                  }}
                  label="Baustelle"
                  type="number"
                />
              </FilterGridItem>
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
          <CardHeader title="Ergebnisse" />
          <CardContent>
            <AppDataGrid loading={loading} disablePagination data={data} columns={columns}></AppDataGrid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
