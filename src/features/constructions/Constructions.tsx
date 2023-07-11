import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppGridField } from '../../components/AppGridField';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { FilterWrapperCard } from '../../components/filters/FilterWrapperCard';
import { GenericBooleanFilter } from '../../components/filters/GenericBooleanFilter';
import { loadConstructions } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ConstructionsDateRangeFilter } from './ConstructionsDateRangeFilter';
import CreateConstruction from './CreateConstruction';

import { DateRange } from 'mui-daterange-picker-orient';

export default function Constructions() {
  const user = useCurrentUser();
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [active, setActive] = useState<boolean | undefined>(true);
  const [confirmed, setConfirmed] = useState<boolean | undefined>(undefined);

  const columns: GridColDef[] = useMemo(() => {
    const arr: GridColDef[] = [
      {
        field: 'id',
        headerName: 'ID',
        renderCell({ id }) {
          return <Link to={`${id}`}>{id}</Link>;
        },
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
      },
      {
        field: 'start',
        headerName: 'Anfang',
      },
      {
        field: 'end',
        headerName: 'Ende',
      },
      {
        field: 'allocatedPersons',
        headerName: 'Arbeiter',
      },
      {
        headerName: 'Aktiv',
        field: 'active',
        type: 'boolean',
      },
      {
        headerName: 'Bestätigt',
        field: 'confirmed',
        type: 'boolean',
      },
    ];
    return arr;
  }, []);

  const onReset = useCallback(() => {
    setActive(undefined);
    setConfirmed(undefined);
    setDateRange({});
  }, []);

  const handleSearchRequest = () => {
    const queryObj = {
      filters: {
        start: {
          $gte: dateRange.startDate,
          $lte: dateRange.endDate,
        },
        tenant: user?.tenant,
        active,
        confirmed,
      },
      sort: { '0': 'start:asc' },
    };

    loadConstructions(queryObj).then(setConstructions).catch(console.log);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterWrapperCard onSearch={handleSearchRequest} onReset={onReset}>
          <ConstructionsDateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
          <AppGridField>
            <GenericBooleanFilter label="Aktiv" value={active} setValue={setActive} />
          </AppGridField>
          <AppGridField>
            <GenericBooleanFilter label="Bestätigt" value={confirmed} setValue={setConfirmed} />
          </AppGridField>
        </FilterWrapperCard>
        <Card>
          <CardHeader title="Ergebnisse" />
          <CardContent>
            <AppDataGrid disablePagination data={constructions} columns={columns} />
          </CardContent>
        </Card>
        <CreateConstruction />
      </Box>
    </>
  );
}
