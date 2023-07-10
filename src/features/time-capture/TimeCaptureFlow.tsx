import { Alert, AlertColor, Box, Snackbar } from '@mui/material';

import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { AppDialog } from '../../components/AppDialog';
import AddFab from '../../components/aa-shared/AddFab';
import { DEFAULT_HOURS } from '../../constants';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useLoadActiveConstructions } from '../../hooks/useLoadActiveConstructions';
import { useLoadJobs } from '../../hooks/useLoadJobs';
import { AppState } from '../../store';
import { getCurrentDBDate } from '../../utils';
import DailyEntryEditor from './DailyEntryEditor';

import { current } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';

interface Props {
  requestUpdate(): void;
}

export function TimeCaptureFlow({ requestUpdate }: Props) {
  useLoadActiveConstructions();
  useLoadJobs();

  const user = useCurrentUser();

  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const initialDailyEntry = {
    date: getCurrentDBDate(),
    type: 'Arbeit',
    username: user?.username,
    tenant: user?.tenant,
  } as DailyEntry;

  const [dailyEntry, setDailyEntry] = useState<DailyEntry>(initialDailyEntry);

  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([
    {
      hours: '8',
    } as WorkEntry,
  ]);

  const workEntriesIds = useRef<number[]>([]);
  const severity = useRef<AlertColor>('error');
  const alertMessage = useRef('');

  const errorHandler = useCallback((e: any) => {
    console.log(e);
    severity.current = 'error';
    alertMessage.current = 'Zeiten konnten nicht gespeichert werden';
    setOpenSnackbar(true);
    return;
  }, []);

  const handleSave = async () => {
    if (!user) {
      //never happens
      return;
    }
    if (dailyEntry.type === 'Arbeit') {
      /*
      UPLOAD WORK ENTRIES
      */
      for (const we of workEntries) {
        we.username = user.username;
        we.tenant = user.tenant;
        we.date = dailyEntry.date;
        await appRequest('post')('work-entries', {
          data: we,
        })
          .then((res) => {
            workEntriesIds.current = [...workEntriesIds.current, res.data.id];
          })
          .catch((e) => {
            errorHandler(e);
            throw e;
          });
      }
    }

    /*
     CTREATE UPLOAD DAILY ENTRY
    */
    const toPersist = cloneDeep(dailyEntry);
    const sum =
      dailyEntry.type === 'Arbeit'
        ? workEntries.reduce((acc, next) => {
            return acc + Number(next.hours);
          }, 0) || 0
        : DEFAULT_HOURS;

    toPersist.username = user.username;
    toPersist.tenant = user.tenant;
    toPersist.sum = sum;
    if (sum > DEFAULT_HOURS) {
      toPersist.overload = sum - DEFAULT_HOURS;
    }
    if (sum < DEFAULT_HOURS) {
      toPersist.underload = sum - DEFAULT_HOURS;
    }
    if (workEntriesIds.current.length > 0) {
      toPersist.work_entries = workEntriesIds.current;
    }

    appRequest('post')('daily-entries', { data: toPersist })
      .then(() => {
        severity.current = 'success';
        alertMessage.current = 'Zeiten erfolgreich gespeichert';
        setOpenSnackbar(true);
      })
      .catch(errorHandler)
      .finally(() => {
        workEntriesIds.current = [];
        setWorkEntries([]);
        setDailyEntry(initialDailyEntry);
        setOpen(false);
        requestUpdate();
      });
  };

  return (
    <>
      <AppDialog title="Zeit eintragen" open={open} onClose={() => setOpen(false)} onConfirm={handleSave}>
        <Box width={'inherit'} maxWidth={1000} marginX="auto" height={'100%'}>
          <DailyEntryEditor
            workEntries={workEntries}
            dailyEntry={dailyEntry}
            setWorkEntries={setWorkEntries}
            setDailyEntry={setDailyEntry}
          />
        </Box>
      </AppDialog>
      <AddFab onClick={() => setOpen(true)} />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={3000}
      >
        <Alert severity={severity.current}>{alertMessage.current}</Alert>
      </Snackbar>
    </>
  );
}
