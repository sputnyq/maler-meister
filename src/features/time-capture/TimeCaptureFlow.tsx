import { Alert, AlertColor, Box, Snackbar } from '@mui/material';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AddFab from '../../components/AddFab';
import { AppDialog } from '../../components/AppDialog';
import { DEFAULT_HOURS } from '../../constants';
import { loadDailyEntries } from '../../fetch/api';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import DailyEntryEditor from './DailyEntryEditor';

import { formatISO } from 'date-fns';
import { cloneDeep } from 'lodash';

interface Props {
  requestUpdate(): void;
}

export function TimeCaptureFlow({ requestUpdate }: Props) {
  const user = useCurrentUser();

  const [open, setOpen] = useState(false);
  const [hasEntries, setHasEntries] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const initialDailyEntry = {
    sum: 8,
    date: formatISO(new Date(), { representation: 'date' }),
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

  const invalidEntry = useMemo(() => {
    if (dailyEntry.type !== 'Arbeit') {
      return false;
    }

    return workEntries.some((we) => !we.constructionId || !we.job || !we.hours);
  }, [dailyEntry, workEntries]);

  useEffect(() => {
    if (user?.username && dailyEntry.date) {
      const queryObject = {
        filters: {
          username: {
            $eq: user?.username,
          },
          date: {
            $eq: dailyEntry.date,
          },
        },
      };
      loadDailyEntries(queryObject).then((res) => {
        if (res.meta.pagination.total > 0) {
          setHasEntries(true);
        } else {
          setHasEntries(false);
        }
      });
    }
  }, [dailyEntry.date, user?.username]);

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
        : dailyEntry.sum;

    toPersist.username = user.username;
    toPersist.tenant = user.tenant;
    toPersist.sum = sum;
    toPersist.overload = sum - DEFAULT_HOURS;

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
      <AppDialog
        title="Zeit eintragen"
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleSave}
        confirmDisabled={invalidEntry}
      >
        <Box width={'inherit'} maxWidth={1000} marginX="auto" height={'100%'}>
          <DailyEntryEditor
            hasEntries={hasEntries}
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
