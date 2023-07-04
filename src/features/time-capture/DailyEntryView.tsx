import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { appRequest } from '../../fetch/fetch-client';
import { genericConverter } from '../../utils';
import ConstructionView from './ConstructionView';

export default function DailyEntryView() {
  const params = useParams();
  const id = params?.id;
  const navigate = useNavigate();

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
      navigate('/time-capture');
    }
  };
  return (
    <Box display="flex" flexDirection={'column'} gap={2}>
      {dailyEntry !== null && (
        <Card>
          <CardHeader
            title={new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(new Date(dailyEntry.date))}
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
                      <Card key={index} variant="outlined" sx={{ background: '#fafafa' }}>
                        <CardHeader title={<ConstructionView constructionId={we.constructionId} />}></CardHeader>
                        <CardContent>
                          <Typography variant="subtitle1">{we.username}</Typography>
                          <Box mt={3} display={'flex'} justifyContent="space-between">
                            <Typography variant="caption">{we.job}</Typography>
                            <Typography variant="caption">{`${we.hours} Stunden`}</Typography>
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
              Löschen
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
}
