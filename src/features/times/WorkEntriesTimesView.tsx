import { Box, Card, CardContent } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useEffect, useMemo, useState } from 'react';

import { AppGridField } from '../../components/AppGridField';
import { AppTextField } from '../../components/AppTextField';
import { AppDataGrid } from '../../components/app-data-grid/AppDataGrid';
import { FilterWrapperCard } from '../../components/filters/FilterWrapperCard';
import { loadWorkEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import ConstructionView from '../time-capture/ConstructionView';
import { PastDateRange } from '../time-capture/PastDateRange';
import { HoursOverviewCard, HoursType } from './HoursOverviewCard';
import WorkerNameFilter from './filters/WorkerNameFilter';

import { endOfMonth, formatISO, startOfMonth } from 'date-fns';

export default function WorkEntriesTimesView() {
  const user = useCurrentUser();

  const [curUsername, setCurUsername] = useState('');
  const [constructionId, setConstructionId] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [dateRange, setDateRange] = useState<AppDateRange>({
    start: formatISO(startOfMonth(new Date()), { representation: 'date' }),
    end: formatISO(endOfMonth(new Date()), { representation: 'date' }),
  });

  const [data, setData] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

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
        field: 'hours',
        headerName: 'Stunden',
      },
      {
        field: 'job',
        headerName: 'Aufgabe',
        flex: 1,
      },
      {
        field: 'constructionId',
        headerName: 'Baustelle',
        flex: 1,
        renderCell({ value }) {
          return <ConstructionView constructionId={value} />;
        },
      },
      {
        field: 'username',
        headerName: 'Mitarbeiter',
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIdSearch(constructionId);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [constructionId]);

  useEffect(() => {
    setLoading(true);

    const queryObj = {
      filters: {
        tenant: user?.tenant,
        username: curUsername === '' ? undefined : curUsername,
        date: {
          $gte: dateRange.start,
          $lte: dateRange.end,
        },
        constructionId: idSearch === '' ? undefined : idSearch,
      },
      sort: { '0': 'date:desc' },
      pagination: {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      },
    };

    loadWorkEntries(queryObj)
      .then((res) => {
        setData(res.dailyEntries);
        setRowCount(res.meta.pagination.total);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [
    idSearch,
    curUsername,
    dateRange.end,
    dateRange.start,
    paginationModel.page,
    paginationModel.pageSize,
    user?.tenant,
  ]);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterWrapperCard>
          <PastDateRange dateRange={dateRange} setDateRange={setDateRange} />
          <WorkerNameFilter curUsername={curUsername} setUsername={setCurUsername} />
          <AppGridField>
            <AppTextField
              value={constructionId}
              onChange={(ev) => {
                setConstructionId(ev.target.value);
              }}
              label="Baustellen-ID"
              type="search"
            />
          </AppGridField>
        </FilterWrapperCard>

        <HoursOverviewCard hours={hours} />

        <Card>
          <CardContent>
            <AppDataGrid
              rows={data}
              columns={columns}
              rowCount={rowCount}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              loading={loading}
            />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
