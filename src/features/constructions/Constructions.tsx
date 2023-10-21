import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Button, Card, CardContent } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AppGridField } from '../../components/AppGridField';
import { DeleteIconButton } from '../../components/DeleteIconButton';
import { AppDataGrid } from '../../components/app-data-grid/AppDataGrid';
import { FilterWrapperCard } from '../../components/filters/FilterWrapperCard';
import { GenericBooleanFilter } from '../../components/filters/GenericBooleanFilter';
import { loadConstructions } from '../../fetch/api';
import { constructionById } from '../../fetch/endpoints';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ConstructionsDateRangeFilter } from './ConstructionsDateRangeFilter';
import { CreateConstruction } from './CreateConstruction';
import EditConstructionDialog from './EditConstructionDialog';

export default function Constructions() {
  const user = useCurrentUser();
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [dateRange, setDateRange] = useState<AppDateRange>({});
  const [active, setActive] = useState<boolean | undefined>(undefined);
  const [confirmed, setConfirmed] = useState<boolean | undefined>(undefined);
  const [update, setUpdate] = useState<number>(0);

  const [constructionDialogOpen, setConstructionDialogOpen] = useState(false);
  const curConstructionId = useRef<undefined | number>(undefined);

  const handleDeleteRequest = useCallback((id: string | number, name: string) => {
    const text = `Baustelle "${id} - ${name} wirklich löschen?`;
    if (confirm(text)) {
      appRequest('delete')(constructionById(id)).then(() => {
        setUpdate((u) => u + 1);
      });
    }
  }, []);

  const columns: GridColDef[] = useMemo(() => {
    const arr: GridColDef[] = [
      {
        field: '_ignore',
        headerName: '',
        renderCell({ row }) {
          const { id, name } = row as Construction;
          return <DeleteIconButton onClick={() => handleDeleteRequest(id, name)} />;
        },
      },
      {
        field: 'id',
        headerName: 'ID',
        renderCell({ id }) {
          return (
            <Button
              onClick={() => {
                curConstructionId.current = Number(id);
                setConstructionDialogOpen(true);
              }}
              color="info"
              startIcon={<OpenInNewOutlinedIcon />}
            >
              {id}
            </Button>
          );
        },
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        align: 'left',
        minWidth: 150,
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
  }, [handleDeleteRequest]);

  // grid
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  useEffect(() => {
    setLoading(true);
    const queryObj = {
      filters: {
        start: {
          $gte: dateRange.start,
          $lte: dateRange.end,
        },
        tenant: user?.tenant,
        active,
        confirmed,
      },
      sort: { '0': 'createdAt:desc' },
      pagination: {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      },
    };

    loadConstructions(queryObj)
      .then((res) => {
        setConstructions(res.constructions);
        setRowCount(res.meta.pagination.total);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [active, confirmed, dateRange.end, dateRange.start, paginationModel, user?.tenant, update]);

  return (
    <>
      <EditConstructionDialog
        onClose={() => setConstructionDialogOpen(false)}
        constructionId={curConstructionId.current}
        dialogOpen={constructionDialogOpen}
      />
      <Box display="flex" flexDirection="column" gap={2}>
        <FilterWrapperCard>
          <ConstructionsDateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
          <AppGridField>
            <GenericBooleanFilter label="Aktiv" value={active} setValue={setActive} />
          </AppGridField>
          <AppGridField>
            <GenericBooleanFilter label="Bestätigt" value={confirmed} setValue={setConfirmed} />
          </AppGridField>
        </FilterWrapperCard>
        <Card>
          <CardContent>
            <AppDataGrid
              rows={constructions}
              columns={columns}
              rowCount={rowCount}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              loading={loading}
            />
          </CardContent>
        </Card>
        <CreateConstruction
          onCreateSuccess={() => {
            setUpdate((u) => u + 1);
          }}
        />
      </Box>
    </>
  );
}
