import { Box, Card, CardContent, CardHeader, Chip, Divider, Stack, Typography } from '@mui/material';

import { useEffect, useMemo, useState } from 'react';

import { AppDialog } from '../../components/AppDialog';
import { ColFlexBox } from '../../components/ColFlexBox';
import { ALLOWED_DAYS_TO_REMOVE } from '../../constants';
import { dailyEntryById } from '../../fetch/endpoints';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { formatNumber, genericConverter, getJobColor } from '../../utilities';
import { LoadingScreen } from '../app-structure/LoadingScreen';
import ConstructionView from './ConstructionView';

import { differenceInDays } from 'date-fns';

interface Props {
  dailyEntryId: string | number | undefined;
  dialogOpen: boolean;
  closeDialog(): void;
}

export function DailyEntryViewDialog({ closeDialog, dailyEntryId, dialogOpen }: Props) {
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null);

  const user = useCurrentUser();

  useEffect(() => {
    if (!dailyEntryId) {
      return;
    }
    appRequest('get')(`daily-entries/${dailyEntryId}?populate=*`)
      .then((res) => {
        const next = genericConverter<DailyEntry>(res.data);
        next.work_entries = (next.work_entries as any).data.map((e: any) => genericConverter<WorkEntry>(e));
        setDailyEntry(next);
      })
      .catch((e) => {
        console.log(e);
        setDailyEntry(null);
      });
  }, [dailyEntryId]);

  const allowDelete = useMemo(() => {
    const adminRoles: UserRole[] = ['accountant', 'admin'];

    if (user?.userRole && adminRoles.includes(user.userRole)) {
      return true;
    }
    const date = dailyEntry?.date;

    if (!date) {
      //never happens
      return true;
    }

    return differenceInDays(new Date(date), new Date()) < ALLOWED_DAYS_TO_REMOVE;
  }, [dailyEntry, user]);

  const handleDeleteRequest = async () => {
    const deleteRequest = appRequest('delete');

    if (dailyEntry && Array.isArray(dailyEntry?.work_entries)) {
      for (const we of dailyEntry.work_entries) {
        if (typeof we !== 'number') {
          await deleteRequest(`work-entries/${we.id}`);
        }
      }

      await deleteRequest(dailyEntryById(dailyEntry.id));
    }
  };

  return (
    <AppDialog onClose={closeDialog} open={dialogOpen} onDelete={allowDelete ? handleDeleteRequest : undefined}>
      {dailyEntry === null ? (
        <LoadingScreen />
      ) : (
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
            <ColFlexBox>
              <Box display="flex" gap={2}>
                <Chip label={dailyEntry.type} color={getJobColor(dailyEntry.type)} />
                {Boolean(dailyEntry.sum) && <Chip color="info" label={`${formatNumber(dailyEntry.sum)} Stunden`} />}
              </Box>

              <Stack spacing={2}>
                {dailyEntry.work_entries?.map((we) => {
                  if (typeof we !== 'number') {
                    return (
                      <Card key={we.id} variant="outlined">
                        <CardHeader title={<ConstructionView constructionId={we.constructionId} />} />
                        <CardContent>
                          <Box display={'flex'} justifyContent="space-between">
                            <Typography variant="subtitle2">{we.job}</Typography>
                            <Typography variant="subtitle2">{`${formatNumber(we.hours)} Stunden`}</Typography>
                          </Box>
                          <Box paddingY={2}>
                            <Divider />
                          </Box>

                          {we.start && (
                            <Typography variant="subtitle2">{`Anwesend: ${we.start} - ${we.end}`}</Typography>
                          )}
                          {we.break && <Typography variant="subtitle2">{`Pause:  ${we.break}`}</Typography>}
                        </CardContent>
                      </Card>
                    );
                  }
                })}
              </Stack>
            </ColFlexBox>
          </CardContent>
        </Card>
      )}
    </AppDialog>
  );
}
