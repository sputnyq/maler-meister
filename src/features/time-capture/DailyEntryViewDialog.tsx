import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';

import { useEffect, useMemo, useState } from 'react';

import { AppDialog } from '../../components/AppDialog';
import { appRequest } from '../../fetch/fetch-client';
import { genericConverter } from '../../utilities';
import ConstructionView from './ConstructionView';

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

  useEffect(() => {
    if (!id) {
      return;
    }
    appRequest('get')(`daily-entries/${id}?populate=*`).then((res) => {
      const next = genericConverter<DailyEntry>(res.data);

      next.work_entries = (next.work_entries as any).data.map((e: any) => genericConverter<WorkEntry>(e));

      setDailyEntry(next);
    });
  }, [id]);

  const handleDeleteRequest = async () => {
    const deleteRequest = appRequest('delete');
    if (confirm('Eintrag wirklich löschen?')) {
      if (dailyEntry && Array.isArray(dailyEntry?.work_entries)) {
        for (const we of dailyEntry.work_entries) {
          if (typeof we !== 'number') {
            await deleteRequest(`work-entries/${we.id}`);
          }
        }
      }
      await deleteRequest(`daily-entries/${dailyEntry?.id}`);
      closeDialog?.();
    }
  };
  return (
    <Box display="flex" flexDirection={'column'} gap={2}>
      {dailyEntry !== null && (
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
                <Chip label={dailyEntry.type} color="primary" />
                <Chip color="success" label={`${dailyEntry.sum} Stunden`}></Chip>
              </Box>

              <Stack spacing={2}>
                {dailyEntry.work_entries?.map((we, index) => {
                  if (typeof we !== 'number') {
                    return (
                      <Card key={index} variant="outlined">
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
            <Button onClick={handleDeleteRequest} color="error">
              Eintrag löschen
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
}
