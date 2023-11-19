import { Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';

import AppGrid from '../../../components/AppGrid';
import { AppTextField } from '../../../components/AppTextField';
import { WorkEntryEditor } from './WorkEntryEditor';
import { dailyEntrySignal, setDailyEntrySignalValue } from './timeCaptureSignals';

export function TimeCaptureDialogContent() {
  const isArbeit = dailyEntrySignal.value.type === 'Arbeit';

  const gridProps = { item: true, xs: 12, sm: 4 };
  const toggles: DailyEntryType[] = ['Arbeit', 'Krank', 'Schule', 'Feiertag'];

  return (
    <Box p={2} display="flex" flexDirection={'column'} gap={2}>
      <AppGrid>
        <Grid {...gridProps}>
          <AppTextField
            label="Datum"
            type={'date'}
            value={dailyEntrySignal.value.date}
            onChange={(ev) => {
              setDailyEntrySignalValue({ prop: 'date', value: ev.target.value });
            }}
          />
        </Grid>
        <Grid {...gridProps}>
          <Box width={'100%'} display="flex" justifyContent={'center'}>
            <ToggleButtonGroup
              fullWidth
              exclusive
              value={dailyEntrySignal.value.type}
              onChange={(_, value) => {
                setDailyEntrySignalValue({ prop: 'type', value });
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
            <WorkEntryEditor />
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
