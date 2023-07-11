import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import RequestDailyViewButton from '../../components/RequestDailyViewButton';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { DEFAULT_HOURS } from '../../constants';
import { appRequest } from '../../fetch/fetch-client';
import { AppState } from '../../store';
import { buildQuery, genericConverter, getMonthStart } from '../../utilities';
import { DailyEntryViewDialog } from './DailyEntryViewDialog';

interface Props {
  update: number;
  requestUpdate(): void;
}

export function UserTimes({ update, requestUpdate }: Props) {
  const username = useSelector<AppState, string | undefined>((s) => s.login.user?.username);

  const [monthValue, setMonthValue] = useState<'current' | 'last'>('current');
  const [data, setData] = useState<DailyEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dailyEntryId = useRef('');

  const columns: GridColDef[] = useMemo(() => {
    const cols: GridColDef[] = [
      {
        field: 'date',
        flex: 1,
        headerName: 'Datum',
        align: 'left',
        renderCell({ value, id }) {
          return <RequestDailyViewButton value={value} onClick={() => handleDialogRequest(id)} />;
        },
      },
      {
        field: 'type',
        headerName: 'Tätigkeit',
      },
      {
        field: 'sum',
        headerName: 'Std.',
        width: 80,
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
    const buildSearchQuery = () =>
      buildQuery({
        filters: {
          username: {
            $eq: username,
          },
          date: {
            $gte: monthValue === 'current' ? getMonthStart() : getMonthStart(-1),
            $lt: monthValue === 'current' ? undefined : getMonthStart(),
          },
        },
        sort: { '0': 'date:desc' },
      });

    setLoading(true);

    appRequest('get')(`daily-entries?${buildSearchQuery()}`)
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

  const allHours = useMemo(() => data.reduce((acc, cur) => acc + cur.sum, 0), [data]);

  const handleDialogRequest = (id: any) => {
    dailyEntryId.current = id;
    setDialogOpen(true);
  };

  const handleCloseRequest = () => {
    requestUpdate();
    setDialogOpen(false);
  };

  return (
    <>
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

      <DailyEntryViewDialog
        closeDialog={handleCloseRequest}
        dailyEntryId={dailyEntryId.current}
        dialogOpen={dialogOpen}
      />
    </>
  );
}
