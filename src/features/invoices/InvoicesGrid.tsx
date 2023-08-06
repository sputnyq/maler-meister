import { Box, Card, CardContent } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppGridField } from '../../components/AppGridField';
import { AppTextField } from '../../components/AppTextField';
import { AppDataGrid } from '../../components/app-data-grid/AppDataGrid';
import { FilterWrapperCard } from '../../components/filters/FilterWrapperCard';
import { loadInvoices } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import ConstructionView from '../time-capture/ConstructionView';
import { PastDateRange } from '../time-capture/PastDateRange';

export function InvoicesGrid() {
  const user = useCurrentUser();

  const [rows, setRows] = useState<AppInvoice[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [id, setId] = useState<string>('');
  const [offerId, setOfferId] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [constrId, setConstrId] = useState<string>('');

  const [idSearch, setIdSearch] = useState<string>('');
  const [offerIdSearch, setOfferIdSearch] = useState<string>('');
  const [lastNameSearch, setLastNameSearch] = useState<string>('');
  const [constrIdSearch, setConstrIdSearch] = useState<string>('');

  const [dateRange, setDateRange] = useState<AppDateRange>({
    start: undefined,
    end: undefined,
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIdSearch(id);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [id]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setOfferIdSearch(offerId);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [offerId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setConstrIdSearch(constrId);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [constrId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLastNameSearch(lastName);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [lastName]);

  useEffect(() => {
    let queryObj;

    if (idSearch) {
      queryObj = {
        filters: {
          tenant: user?.tenant,
          id: idSearch,
        },
      };
    } else {
      queryObj = {
        filters: {
          tenant: user?.tenant,
          lastName: {
            $containsi: lastNameSearch === '' ? undefined : lastNameSearch,
          },
          offerId: offerIdSearch === '' ? undefined : offerIdSearch,
          constructionId: constrIdSearch === '' ? undefined : constrIdSearch,
          createdAt: {
            $gte: dateRange.start,
            $lte: dateRange.end,
          },
        },
        sort: { '0': 'date:desc' },
        pagination: {
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
        },
      };
    }

    setLoading(true);
    loadInvoices(queryObj)
      .then((res) => {
        setRows(res.appInvoices);
        setRowCount(res.meta.pagination.total);
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  }, [
    dateRange.end,
    dateRange.start,
    paginationModel.page,
    paginationModel.pageSize,
    user?.tenant,
    lastNameSearch,
    offerIdSearch,
    constrIdSearch,
    idSearch,
  ]);

  const columns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID',
        renderCell({ id }) {
          return <Link to={`${id}`}>{id}</Link>;
        },
      },
      {
        field: 'company',
        headerName: 'Firma',
      },

      {
        field: 'lastName',
        headerName: 'Kunde',
        flex: 1,
        renderCell({ row }) {
          const { salutation, lastName, firstName } = row as AppOffer;
          return `${salutation} ${firstName} ${lastName}`;
        },
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
        field: 'createdAt',
        headerName: 'Erstellt',
        minWidth: 160,
        renderCell({ value }) {
          return new Intl.DateTimeFormat('de-DE', { timeStyle: 'medium', dateStyle: 'medium' }).format(new Date(value));
        },
      },
      {
        field: 'updatedAt',
        headerName: 'Aktualisiert',
        minWidth: 160,
        renderCell({ value }) {
          return new Intl.DateTimeFormat('de-DE', { timeStyle: 'medium', dateStyle: 'medium' }).format(new Date(value));
        },
      },
    ] as GridColDef[];
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FilterWrapperCard>
        <AppGridField>
          <AppTextField type="search" label="ID" value={id} onChange={(ev) => setId(ev.target.value?.trim())} />
        </AppGridField>
        <AppGridField>
          <AppTextField
            type="search"
            label="Angebot-ID"
            value={offerId}
            onChange={(ev) => setOfferId(ev.target.value?.trim())}
          />
        </AppGridField>
        <AppGridField>
          <AppTextField
            type="search"
            label="Baustellen-ID"
            value={constrId}
            onChange={(ev) => setConstrId(ev.target.value?.trim())}
          />
        </AppGridField>
        <AppGridField>
          <AppTextField
            type="search"
            label="Nachname"
            value={lastName}
            onChange={(ev) => setLastName(ev.target.value)}
          />
        </AppGridField>
        <PastDateRange dateRange={dateRange} setDateRange={setDateRange} />
      </FilterWrapperCard>
      <Card>
        <CardContent>
          <AppDataGrid
            columns={columns}
            rows={rows}
            loading={loading}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
