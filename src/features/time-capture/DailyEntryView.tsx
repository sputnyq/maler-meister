import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import { useEffect, useMemo, useState } from 'react';

import { AppFullScreenDialog } from '../../components/aa-shared/AppFullScreenDialog';
import { appRequest } from '../../fetch/fetch-client';
import { useIsSmall } from '../../hooks/useIsSmall';
import { genericConverter } from '../../utils';
import ConstructionView from './ConstructionView';

interface Props {
  dailyEntryId: string | number;
  dialogOpen: boolean;
  closeDialog(): void;
}

export function DailyEntryView({ closeDialog, dailyEntryId, dialogOpen }: Props) {
  const isSmall = useIsSmall();

  const dailyEntryView = useMemo(
    () => <DailyEntryViewCard dailyEntryId={dailyEntryId} closeDialog={closeDialog} />,
    [dailyEntryId, closeDialog],
  );
  const title = 'Tagesansicht';

  return isSmall ? (
    <AppFullScreenDialog open={dialogOpen} title={title} onClose={closeDialog} showConfirm={false}>
      {dailyEntryView}
    </AppFullScreenDialog>
  ) : (
    <Dialog open={dialogOpen} onClose={closeDialog}>
      <DialogTitle>
        <Box display={'flex'} alignItems="center">
          <Typography flexGrow={1}>{title}</Typography>
          <IconButton onClick={closeDialog}>
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>{dailyEntryView}</DialogContent>
    </Dialog>
  );
}

function DailyEntryViewCard({ dailyEntryId: id, closeDialog }: Partial<Props>) {
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null);

  useEffect(() => {
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
