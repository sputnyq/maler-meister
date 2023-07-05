import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { DEFAULT_HOURS } from '../../constants';
import { appRequest } from '../../fetch/fetch-client';
import { AppState } from '../../store';
import { genericConverter, getMonthStart } from '../../utils';

import qs from 'qs';

interface Props {
  update: number;
}

export function UserTimes({ update }: Props) {
  const [monthValue, setMonthValue] = useState<'current' | 'last'>('current');

  const [data, setData] = useState<DailyEntry[]>([]);

  const [loading, setLoading] = useState(false);
  const username = useSelector<AppState, string | undefined>((s) => s.login.user?.username);

  const columns: GridColDef[] = useMemo(() => {
    const cols: GridColDef[] = [
      {
        field: 'date',
        flex: 1,
        headerName: 'Datum',
        renderCell({ value, id }) {
          return (
            <Link style={{ textDecoration: 'none' }} to={`/daily-entry/${id}`}>
              {new Intl.DateTimeFormat('de-DE', {
                month: 'short',
                weekday: 'long',
                day: 'numeric',
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
        field: 'sum',
        headerName: 'Std.',

        renderCell({ value }) {
          const diff = Number(value) - DEFAULT_HOURS;
          if (diff < 0) {
            return <Chip size="small" label={value} color={'warning'} />;
          } else if (diff > 0) {
            return <Chip size="small" label={value} color={'primary'} />;
          } else {
            return <Chip size="small" label={value} color={'success'} />;
          }
        },
      },
    ];

    return cols;
  }, []);

  useEffect(() => {
    const filtersObj: any = {
      username: {
        $eq: username,
      },
    };
    if (monthValue === 'current') {
      filtersObj.date = {
        $gte: getMonthStart(),
      };
    } else {
      filtersObj.date = {
        $gte: getMonthStart(-1),
        $lt: getMonthStart(),
      };
    }

    const query = qs.stringify({ filters: filtersObj, sort: { '0': 'date:desc' } });
    setLoading(true);
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
  }, [username, monthValue, update]);

  const allHours = data.reduce((acc, cur) => {
    return acc + cur.sum;
  }, 0);

  return (
    <Box display={'flex'} flexDirection="column" gap={2}>
      <Box maxWidth={400}>
        <ToggleButtonGroup
          color="primary"
          fullWidth
          exclusive
          value={monthValue}
          onChange={(_, value) => {
            value && setMonthValue(value);
          }}
        >
          <ToggleButton size="small" value="current">
            Laufender Monat
          </ToggleButton>
          <ToggleButton size="small" value="last">
            Letzter Monat
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box display={'flex'} justifyContent="space-between">
        <Typography color={'GrayText'} variant="h6">
          Gesamt:
        </Typography>
        <Typography color={'GrayText'} variant="h6">{`${allHours} Stunden`}</Typography>
      </Box>
      <AppDataGrid loading={loading} data={data} columns={columns} disablePagination />
    </Box>
  );
}
