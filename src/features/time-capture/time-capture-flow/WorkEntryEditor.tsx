import { Box, Divider, MenuItem, Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import { AppTextField } from '../../../components/AppTextField';
import { workEntryStubSignal } from '../../../signals';
import { AppState } from '../../../store';
import { formatNumber } from '../../../utilities';
import { TimeCaptureTimePicker } from './TimeCaptureTimePicker';
import { calculateWorkingMinutes, interval2String } from './timeCaptureUtils';

const setWorkEntryValue = (args: { prop: keyof WorkEntryStub; value: any }) => {
  workEntryStubSignal.value = { ...workEntryStubSignal.value, [args.prop]: args.value };
};

export function WorkEntryEditor() {
  const appJobs = useSelector<AppState, AppJob[]>((s) => s.jobs.jobs || []);
  const constructions = useSelector<AppState, Construction[]>((s) => s.construction.activeConstructions || []);

  const getJobName = (jobId: number) => {
    return appJobs.find((j) => j.id === jobId)?.name;
  };

  const duration = (args: { start?: Date; end?: Date }) => {
    const { start, end } = args;
    try {
      if (start && end) {
        return interval2String({ start, end });
      }
    } catch (e) {
      return '';
    }
    return '';
  };

  const workingHours = calculateWorkingMinutes(workEntryStubSignal.value) / 60;

  return (
    <Box display="flex" flexDirection={'column'} gap={2} mt={2}>
      <AppTextField
        select
        label="Baustelle"
        value={workEntryStubSignal.value.constructionId}
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
        value={workEntryStubSignal.value.jobId}
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
        Anwesenheit: {duration({ start: workEntryStubSignal.value.start, end: workEntryStubSignal.value.end })}
      </Typography>

      <Box display="flex" gap={2}>
        <TimeCaptureTimePicker
          label="von"
          value={workEntryStubSignal.value.start || null}
          onChange={(value) => {
            setWorkEntryValue({ prop: 'start', value });
          }}
        />
        <TimeCaptureTimePicker
          label="bis"
          minTime={workEntryStubSignal.value.start}
          value={workEntryStubSignal.value.end || null}
          onChange={(value) => {
            setWorkEntryValue({ prop: 'end', value });
          }}
        />
      </Box>

      <Typography>
        Pause: {duration({ start: workEntryStubSignal.value.breakStart, end: workEntryStubSignal.value.breakEnd })}
      </Typography>

      <Box display="flex" gap={2}>
        <TimeCaptureTimePicker
          label="von"
          minTime={workEntryStubSignal.value.start}
          maxTime={workEntryStubSignal.value.end}
          value={workEntryStubSignal.value.breakStart || null}
          onChange={(value) => {
            setWorkEntryValue({ prop: 'breakStart', value });
          }}
        />
        <TimeCaptureTimePicker
          label="bis"
          minTime={workEntryStubSignal.value.breakStart}
          maxTime={workEntryStubSignal.value.end}
          value={workEntryStubSignal.value.breakEnd || null}
          onChange={(value) => {
            setWorkEntryValue({ prop: 'breakEnd', value });
          }}
        />
      </Box>
      <Typography variant="h6" color={workingHours >= 10 ? 'error' : 'primary'}>
        {!isNaN(workingHours) ? `Arbeitszeit: ${formatNumber(workingHours)} Stunden` : ''}
      </Typography>
    </Box>
  );
}
