import { Box, Divider, MenuItem, Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import { AppTextField } from '../../../components/AppTextField';
import { AppState } from '../../../store';
import { formatNumber } from '../../../utilities';
import { TimeCaptureTimePicker } from './TimeCaptureTimePicker';
import { calculateWorkingMinutes, interval2String } from './timeCaptureUtils';

interface Props {
  workEntryStub: WorkEntryStub;
  setWorkEntryStubValue: (args: { prop: keyof WorkEntryStub; value: any }) => void;
}

export function WorkEntryEditor({ setWorkEntryStubValue, workEntryStub }: Readonly<Props>) {
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

  const workingHours = calculateWorkingMinutes(workEntryStub) / 60;

  return (
    <Box display="flex" flexDirection={'column'} gap={2} mt={2}>
      <AppTextField
        select
        label="Baustelle"
        value={workEntryStub.constructionId}
        onChange={(ev) => {
          setWorkEntryStubValue({ prop: 'constructionId', value: ev.target.value });
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
          setWorkEntryStubValue({ prop: 'job', value: getJobName(jobId) });
          setWorkEntryStubValue({ prop: 'jobId', value: jobId });
        }}
        value={workEntryStub.jobId}
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

      <Typography>Anwesenheit: {duration({ start: workEntryStub.start, end: workEntryStub.end })}</Typography>

      <Box display="flex" gap={2}>
        <TimeCaptureTimePicker
          label="von"
          value={workEntryStub.start || null}
          onChange={(value) => {
            setWorkEntryStubValue({ prop: 'start', value });
          }}
        />
        <TimeCaptureTimePicker
          label="bis"
          minTime={workEntryStub.start}
          value={workEntryStub.end || null}
          onChange={(value) => {
            setWorkEntryStubValue({ prop: 'end', value });
          }}
        />
      </Box>

      <Typography>Pause: {duration({ start: workEntryStub.breakStart, end: workEntryStub.breakEnd })}</Typography>

      <Box display="flex" gap={2}>
        <TimeCaptureTimePicker
          label="von"
          minTime={workEntryStub.start}
          maxTime={workEntryStub.end}
          value={workEntryStub.breakStart || null}
          onChange={(value) => {
            setWorkEntryStubValue({ prop: 'breakStart', value });
          }}
        />
        <TimeCaptureTimePicker
          label="bis"
          minTime={workEntryStub.breakStart}
          maxTime={workEntryStub.end}
          value={workEntryStub.breakEnd || null}
          onChange={(value) => {
            setWorkEntryStubValue({ prop: 'breakEnd', value });
          }}
        />
      </Box>
      <Typography variant="h6" color={workingHours >= 10 ? 'error' : 'primary'}>
        {!isNaN(workingHours) ? `Arbeitszeit: ${formatNumber(workingHours)} Stunden` : ''}
      </Typography>
    </Box>
  );
}
