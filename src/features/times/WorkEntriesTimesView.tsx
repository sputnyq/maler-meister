import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo, useState } from 'react';

import { AppTextField } from '../../components/aa-shared/AppTextField';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { appRequest } from '../../fetch/fetch-client';
import { buildQuery, genericConverter } from '../../utils';
import ConstructionView from '../time-capture/ConstructionView';
import { HoursOverviewCard, HoursType } from './HoursOverviewCard';
import { DateRangeWidget } from './filters/DateRangeWidget';
import FilterGridItem from './filters/FilterGridItem';
import { FilterTile } from './filters/FilterTile';
import WorkerNameFilter from './filters/WorkerNameFilter';

import { DateRange } from 'mui-daterange-picker-orient';

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

  const hours = useMemo(() => {
    let sum = 0;

    data.forEach((de) => {
      sum += Number(de.hours);
    });

    return [
      {
        amount: sum,
        title: 'Gesamt',
      },
    ] as HoursType[];
  }, [data]);

  const reset = useCallback(() => {
    setCurUsername('');
    setDateRange({});
    setConstructionId('');
  }, []);

  const buildSearchQuery = () => {
    return buildQuery({
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
  };

  const handleSearchRequest = () => {
    setLoading(true);

    appRequest('get')(`work-entries?${buildSearchQuery()}`)
      .then((res) => {
        const data = res.data.map((e: any) => genericConverter<WorkEntry[]>(e));

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
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterTile onReset={reset} onSearch={handleSearchRequest}>
          <DateRangeWidget dateRange={dateRange} setDateRange={setDateRange} />
          <WorkerNameFilter curUsername={curUsername} setUsername={setCurUsername} />
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
        </FilterTile>

        <HoursOverviewCard hours={hours} />

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
