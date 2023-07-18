import { Box, Card, CardContent } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppGridField } from '../../components/AppGridField';
import { AppTextField } from '../../components/aa-shared/AppTextField';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { FilterWrapperCard } from '../../components/filters/FilterWrapperCard';
import { loadOffers } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { PastDateRange } from '../time-capture/PastDateRange';

export default function OffersGrid() {
  const user = useCurrentUser();

  const [rows, setRows] = useState<AppOffer[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [lastName, setLastName] = useState<string>('');
  const [offerId, setOfferId] = useState<string>('');

  const [lastNameSearch, setLastNameSearch] = useState<string>('');
  const [offerIdSearch, setOfferIdSearch] = useState<string>('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setOfferIdSearch(offerId);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [offerId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLastNameSearch(lastName);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [lastName]);

  const [dateRange, setDateRange] = useState<AppDateRange>({
    start: undefined,
    end: undefined,
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    let queryObj;

    if (offerIdSearch) {
      queryObj = {
        filters: {
          tenant: user?.tenant,
          id: offerIdSearch,
        },
      };
    } else {
      queryObj = {
        filters: {
          tenant: user?.tenant,
          lastName: {
            $containsi: lastNameSearch === '' ? undefined : lastNameSearch,
          },
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
    loadOffers(queryObj)
      .then((res) => {
        setRows(res.appOffers);
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
        field: 'zip',
        headerName: 'Adresse',
        flex: 1,
        renderCell({ row }) {
          const { street, number, zip, city } = row as AppOffer;
          return `${street} ${number}, ${zip} ${city}`;
        },
      },
      {
        field: 'createdAt',
        headerName: 'Erstellt',
        type: 'dateTime',
        minWidth: 160,
        renderCell({ value }) {
          return new Intl.DateTimeFormat('de-DE', { timeStyle: 'medium', dateStyle: 'medium' }).format(new Date(value));
        },
      },
      {
        field: 'updatedAt',
        headerName: 'Aktualisiert',
        type: 'dateTime',
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
          <AppTextField type="search" label="ID" value={offerId} onChange={(ev) => setOfferId(ev.target.value)} />
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
