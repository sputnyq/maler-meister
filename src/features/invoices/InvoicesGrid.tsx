import { Button, Card, CardContent, MenuItem } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppGridField } from '../../components/AppGridField';
import { AppTextField } from '../../components/AppTextField';
import { ColFlexBox } from '../../components/ColFlexBox';
import { AppDataGrid } from '../../components/app-data-grid/AppDataGrid';
import { FilterWrapperCard } from '../../components/filters/FilterWrapperCard';
import { loadInvoices } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { usePersistPageSize } from '../../hooks/usePersistPageSize';
import { calculatePriceSummary, euroValue, fullCustomerName } from '../../utilities';
import ConstructionView from '../time-capture/ConstructionView';
import { PastDateRange } from '../time-capture/PastDateRange';

import { capitalize } from 'lodash';

export function InvoicesGrid() {
  const { pageSize, onPaginationModelChange } = usePersistPageSize('invoices-pageSize', 50);

  const user = useCurrentUser();

  const [rows, setRows] = useState<AppInvoice[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [id, setId] = useState<string>('');
  const [offerId, setOfferId] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [constrId, setConstrId] = useState<string>('');
  const [isPaid, setIsPaid] = useState<'Bezahlt' | 'Unbezahlt' | 'Alle'>('Alle');

  const [idSearch, setIdSearch] = useState<string>('');
  const [offerIdSearch, setOfferIdSearch] = useState<string>('');
  const [lastNameSearch, setLastNameSearch] = useState<string>('');
  const [constrIdSearch, setConstrIdSearch] = useState<string>('');
  const [isPaidSearch, setIsPaidSearch] = useState<boolean | undefined>(undefined);

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
      let next = undefined;
      if (isPaid === 'Bezahlt') {
        next = true;
      } else if (isPaid === 'Unbezahlt') {
        next = false;
      } else {
        next = undefined;
      }
      setIsPaidSearch(next);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [isPaid]);

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
          isPaid: isPaidSearch,
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
        sort: { '0': 'createdAt:desc' },
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
    isPaidSearch,
  ]);

  const columns = useMemo(() => {
    const dtFormat = new Intl.DateTimeFormat('de-DE', { timeStyle: 'short', dateStyle: 'short' });
    return [
      {
        field: 'id',
        headerName: 'ID',
        renderCell({ id }) {
          return (
            <Link to={`${id}`}>
              <Button>{id}</Button>
            </Link>
          );
        },
      },
      {
        field: 'invoiceType',
        headerName: 'Typ',
        renderCell(params) {
          return capitalize(params.row.invoiceType);
        },
      },
      {
        field: 'offerId',
        headerName: 'Angebot',
      },

      {
        field: 'lastName',
        headerName: 'Kunde',
        flex: 1,
        minWidth: 250,
        renderCell({ row }) {
          return fullCustomerName(row as AppInvoice);
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
          return dtFormat.format(new Date(value));
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
      {
        field: 'offerServices',
        headerName: 'Netto / Brutto',
        minWidth: 160,
        renderCell(params: GridRenderCellParams<AppInvoice>) {
          const { offerServices } = params.row;
          const { brutto, netto } = calculatePriceSummary(offerServices);
          return `${euroValue(netto)} / ${euroValue(brutto)}`;
        },
      },
      {
        field: 'isPaid',
        headerName: 'Bezahlt',
        type: 'boolean',
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
            value={id}
            onChange={(ev) => setId(ev.target.value?.trim())}
          />
        </AppGridField>
        <AppGridField>
          <AppTextField
            type="search"
            label="Angebots-ID"
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
        <AppGridField>
          <AppTextField select value={isPaid} onChange={(ev) => setIsPaid(ev.target.value as any)}>
            {['Alle', 'Bezahlt', 'Unbezahlt'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </AppTextField>
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
