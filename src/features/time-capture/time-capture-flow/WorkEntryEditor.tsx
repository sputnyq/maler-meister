import { Box, Divider, MenuItem, Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import { AppTextField } from '../../../components/AppTextField';
import { AppState } from '../../../store';
import { formatNumber } from '../../../utilities';
import { TimeCaptureTimePicker } from './TimeCaptureTimePicker';
import { setWorkEntryValue, workEntrySignal } from './timeCaptureSignals';
import { calculateWorkingMinutes, interval2String } from './timeCaptureUtils';

export function WorkEntryEditor() {
  const appJobs = useSelector<AppState, AppJob[]>((s) => s.jobs.jobs || []);
  const constructions = useSelector<AppState, Construction[]>((s) => s.construction.activeConstructions || []);

  const getJobName = (jobId: number) => {
    return appJobs.find((j) => j.id === jobId)?.name;
  };

  const duration = (args: { start?: Date; end?: Date }) => {
    const { start, end } = args;
    if (start && end) {
      return interval2String({ start, end });
    }
    return '';
  };

  const workingHours = calculateWorkingMinutes(workEntrySignal.value) / 60;

  return (
    <Box display="flex" flexDirection={'column'} gap={2} mt={2}>
      <AppTextField
        select
        label="Baustelle"
        value={workEntrySignal.value.constructionId}
        onChange={(ev) => {
          setWorkEntryValue({ prop: 'constructionId', value: ev.target.value });
        }}
      >
        {constructions.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {`${id} - ${name}`}
          </MenuItem>
        ))}
      </AppTextField>

      <AppTextField
        onChange={(ev) => {
          const jobId = Number(ev.target.value);
          setWorkEntryValue({ prop: 'job', value: getJobName(jobId) });
          setWorkEntryValue({ prop: 'jobId', value: jobId });
        }}
        value={workEntrySignal.value.jobId}
        select
        type="number"
        label="Tätigkeit"
      >
        {appJobs.map((job) => {
          return (
            <MenuItem key={job.id} value={job.id}>
              {job.name}
            </MenuItem>
          );
        })}
      </AppTextField>

      <Divider sx={{ marginTop: 2 }} />

      <Typography>
        Anwesenheit: {duration({ start: workEntrySignal.value.start, end: workEntrySignal.value.end })}
      </Typography>

      <Box display="flex" gap={2}>
        <TimeCaptureTimePicker
          label="von"
          value={workEntrySignal.value.start}
          onAccept={(value) => {
            setWorkEntryValue({ prop: 'start', value });
          }}
        />
        <TimeCaptureTimePicker
          label="bis"
          minTime={workEntrySignal.value.start}
          value={workEntrySignal.value.end}
          onAccept={(value) => {
            setWorkEntryValue({ prop: 'end', value });
          }}
        />
      </Box>

      <Typography>
        Pause: {duration({ start: workEntrySignal.value.breakStart, end: workEntrySignal.value.breakEnd })}
      </Typography>

      <Box display="flex" gap={2}>
        <TimeCaptureTimePicker
          label="von"
          minTime={workEntrySignal.value.start}
          maxTime={workEntrySignal.value.end}
          value={workEntrySignal.value.breakStart}
          onAccept={(value) => {
            setWorkEntryValue({ prop: 'breakStart', value });
          }}
        />
        <TimeCaptureTimePicker
          label="bis"
          minTime={workEntrySignal.value.start}
          maxTime={workEntrySignal.value.end}
          value={workEntrySignal.value.breakEnd}
          onAccept={(value) => {
            setWorkEntryValue({ prop: 'breakEnd', value });
          }}
        />
      </Box>
      <Typography variant="h6" color={workingHours >= 10 ? 'error' : 'primary'}>
        Arbeitszeit: {formatNumber(workingHours)} Stunden
      </Typography>
    </Box>
  );
}
