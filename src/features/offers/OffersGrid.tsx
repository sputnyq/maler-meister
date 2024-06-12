import { Box, Button, Card, CardContent } from '@mui/material';
import { GridCellParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppGridField } from '../../components/AppGridField';
import { AppTextField } from '../../components/AppTextField';
import { ColFlexBox } from '../../components/ColFlexBox';
import CustomerGridCell from '../../components/CustomerGridCell';
import OfferServicesAmountGridCell from '../../components/OfferServicesAmountGridCell';
import { AppDataGrid } from '../../components/app-data-grid/AppDataGrid';
import { FilterWrapperCard } from '../../components/filters/FilterWrapperCard';
import { loadOffers } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { usePersistPageSize } from '../../hooks/usePersistPageSize';
import ConstructionView from '../time-capture/ConstructionView';
import { PastDateRange } from '../time-capture/PastDateRange';
import { OfferInvoiceLinks } from './OfferInvoiceLinks';

export default function OffersGrid() {
  const { pageSize, onPaginationModelChange } = usePersistPageSize('offers-pageSize', 50);

  const user = useCurrentUser();

  const [rows, setRows] = useState<AppOffer[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [lastName, setLastName] = useState<string>('');
  const [offerId, setOfferId] = useState<string>('');
  const [constrId, setConstrId] = useState<string>('');

  const [lastNameSearch, setLastNameSearch] = useState<string>('');
  const [offerIdSearch, setOfferIdSearch] = useState<string>('');
  const [constrIdSearch, setConstrIdSearch] = useState<string>('');

  const [dateRange, setDateRange] = useState<AppDateRange>({
    start: undefined,
    end: undefined,
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize,
  });

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
          constructionId: constrIdSearch === '' ? undefined : constrIdSearch,
          updatedAt: {
            $gte: dateRange.start,
            $lte: dateRange.end,
          },
        },
        sort: { '0': 'createdAt:desc' },
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
    constrIdSearch,
  ]);

  const columns = useMemo(() => {
    const dtFormat = new Intl.DateTimeFormat('de-DE', { timeStyle: 'short', dateStyle: 'short' });

    return [
      {
        field: 'id',
        headerName: 'ID',
        width: 80,
        renderCell({ id }) {
          return (
            <Box>
              <Link to={`${id}`}>
                <Button size="small">{id}</Button>
              </Link>
            </Box>
          );
        },
      },

      {
        field: 'lastName',
        headerName: 'Kunde',
        flex: 1,
        minWidth: 250,
        renderCell({ row }: GridCellParams<AppOffer>) {
          return <CustomerGridCell obj={row} />;
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
        field: 'offerServices',
        headerName: 'Netto',
        minWidth: 120,
        renderCell({ value }: GridRenderCellParams<AppInvoice, OfferService[]>) {
          return <OfferServicesAmountGridCell offerServices={value} />;
        },
      },
      {
        field: '_links',
        headerName: 'Rechnungen',
        renderCell(param: { row: AppOffer }) {
          return <OfferInvoiceLinks offerId={param.row.id} />;
        },
      },
      {
        field: 'updatedAt',
        headerName: 'Aktualisiert',
        minWidth: 160,
        renderCell({ value }) {
          return dtFormat.format(new Date(value));
        },
      },
    ] as GridColDef[];
  }, []);

  return (
    <ColFlexBox>
      <FilterWrapperCard>
        <AppGridField>
          <AppTextField
            type="search"
            label="ID"
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
      <Card elevation={0}>
        <CardContent>
          <AppDataGrid
            columns={columns}
            rows={rows}
            loading={loading}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange(setPaginationModel)}
          />
        </CardContent>
      </Card>
    </ColFlexBox>
  );
}
