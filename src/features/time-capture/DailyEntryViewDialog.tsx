import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { useEffect, useMemo, useState } from 'react';

import { AppDialog } from '../../components/AppDialog';
import { ALLOWED_DAYS_TO_RENOVE } from '../../constants';
import { dailyEntryById } from '../../fetch/endpoints';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { dailyEntriesSignal } from '../../signals';
import { genericConverter, getJobColor } from '../../utilities';
import ConstructionView from './ConstructionView';

import { addDays } from 'date-fns';

interface Props {
  dailyEntryId: string | number | undefined;
  dialogOpen: boolean;
  closeDialog(): void;
}

export function DailyEntryViewDialog({ closeDialog, dailyEntryId, dialogOpen }: Props) {
  const dailyEntryView = useMemo(
    () => <DailyEntryViewCard dailyEntryId={dailyEntryId} closeDialog={closeDialog} />,
    [dailyEntryId, closeDialog],
  );

  return (
    <AppDialog showConfirm={false} open={dialogOpen} onClose={closeDialog} title="Tagesansicht">
      {dailyEntryView}
    </AppDialog>
  );
}

function DailyEntryViewCard({ dailyEntryId: id, closeDialog }: Partial<Props>) {
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null);
  const [loading, setLoading] = useState(false);

  const user = useCurrentUser();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    appRequest('get')(`daily-entries/${id}?populate=*`)
      .then((res) => {
        const next = genericConverter<DailyEntry>(res.data);
        next.work_entries = (next.work_entries as any).data.map((e: any) => genericConverter<WorkEntry>(e));
        setDailyEntry(next);
      })
      .catch((e) => {
        console.log(e);
        setDailyEntry(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const disabled = useMemo(() => {
    const adminRoles: UserRole[] = ['accountant', 'admin'];

    if (user?.userRole && adminRoles.includes(user.userRole)) {
      return false;
    }
    const date = dailyEntry?.date;
    if (!date) {
      //never happens
      return false;
    }

    const deDate = new Date(date);
    const limit = addDays(new Date(), ALLOWED_DAYS_TO_RENOVE);
    return deDate < limit;
  }, [dailyEntry, user]);

  const handleDeleteRequest = async () => {
    const deleteRequest = appRequest('delete');

    if (confirm('Eintrag wirklich löschen?')) {
      if (dailyEntry && Array.isArray(dailyEntry?.work_entries)) {
        for (const we of dailyEntry.work_entries) {
          if (typeof we !== 'number') {
            await deleteRequest(`work-entries/${we.id}`);
          }
        }

        await deleteRequest(dailyEntryById(dailyEntry.id));
        dailyEntriesSignal.value = dailyEntriesSignal.value.filter((de) => de.id !== dailyEntry.id);
      }
      closeDialog?.();
    }
  };

  const LoadingSkeleton = useMemo(() => {
    return (
      <Card elevation={0}>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={1}>
            <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rounded" width="100%" height={60} />
            <Skeleton variant="rounded" width="100%" height={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }, []);

  if (loading) {
    return LoadingSkeleton;
  }
  return (
    <Box display="flex" flexDirection={'column'} gap={2}>
      {dailyEntry !== null ? (
        <Card elevation={0}>
          <CardHeader
            title={
              <Box>
                <Typography variant="h6">
                  {new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(new Date(dailyEntry.date))}
                </Typography>
                <Typography>{dailyEntry.username}</Typography>
              </Box>
            }
          />
          <CardContent>
            <Box display="flex" flexDirection={'column'} gap={2}>
              <Box display="flex" gap={2}>
                <Chip label={dailyEntry.type} color={getJobColor(dailyEntry.type)} />
                {Boolean(dailyEntry.sum) && <Chip color="info" label={`${dailyEntry.sum} Stunden`} />}
              </Box>

              <Stack spacing={2}>
                {dailyEntry.work_entries?.map((we) => {
                  if (typeof we !== 'number') {
                    return (
                      <Card key={we.id} variant="outlined">
                        <CardHeader title={<ConstructionView constructionId={we.constructionId} />}></CardHeader>
                        <CardContent>
                          <Box display={'flex'} justifyContent="space-between">
                            <Typography variant="subtitle2">{we.job}</Typography>
                            <Typography variant="subtitle2">{`${we.hours} Stunden`}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  }
                })}
              </Stack>
            </Box>
          </CardContent>
          <CardActions>
            <Button startIcon={<DeleteIcon />} disabled={disabled} onClick={handleDeleteRequest} color="error">
              Eintrag löschen
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Box mt={2}>
          <Typography variant="h5" align="center">
            Kein Eintrag gefunden
          </Typography>
        </Box>
      )}
    </Box>
  );
}
