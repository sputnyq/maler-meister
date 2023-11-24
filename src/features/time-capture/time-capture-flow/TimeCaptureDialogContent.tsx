import { Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';

import AppGrid from '../../../components/AppGrid';
import { AppTextField } from '../../../components/AppTextField';
import { WorkEntryEditor } from './WorkEntryEditor';

interface Props {
  dailyEntryStub: DailyEntry;
  workEntryStub: WorkEntryStub;
  setDailyEntryStubValue: (args: { prop: keyof DailyEntry; value: any }) => void;
  setWorkEntryStubValue: (args: { prop: keyof WorkEntryStub; value: any }) => void;
}

export function TimeCaptureDialogContent({
  dailyEntryStub,
  workEntryStub,
  setDailyEntryStubValue,
  setWorkEntryStubValue,
}: Readonly<Props>) {
  const isArbeit = dailyEntryStub.type === 'Arbeit';

  const gridProps = { item: true, xs: 12, sm: 4 };
  const toggles: DailyEntryType[] = ['Arbeit', 'Krank', 'Schule', 'Feiertag'];

  return (
    <Box p={2} display="flex" flexDirection={'column'} gap={2}>
      <AppGrid>
        <Grid {...gridProps}>
          <AppTextField
            label="Datum"
            type={'date'}
            value={dailyEntryStub.date}
            onChange={(ev) => {
              setDailyEntryStubValue({ prop: 'date', value: ev.target.value });
            }}
          />
        </Grid>
        <Grid {...gridProps}>
          <Box width={'100%'} display="flex" justifyContent={'center'}>
            <ToggleButtonGroup
              fullWidth
              exclusive
              value={dailyEntryStub.type}
              onChange={(_, value) => {
                setDailyEntryStubValue({ prop: 'type', value });
              }}
            >
              {toggles.map((tgl) => (
                <ToggleButton key={tgl} value={tgl} size="small">
                  {tgl}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Grid>

        <Grid {...gridProps} sm={12}>
          {isArbeit ? (
            <WorkEntryEditor workEntryStub={workEntryStub} setWorkEntryStubValue={setWorkEntryStubValue} />
          ) : (
            <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
              <Typography variant="h3">8</Typography>
              <Typography>Stunden werden erfasst.</Typography>
            </Box>
          )}
        </Grid>
      </AppGrid>
    </Box>
  );
}
