import { Alert, AlertColor, Snackbar } from '@mui/material';

import { useRef, useState } from 'react';

import AddFab from '../../../components/AddFab';
import { AppDialog } from '../../../components/AppDialog';
import { DEFAULT_HOURS } from '../../../constants';
import { loadDailyEntries } from '../../../fetch/api';
import { appRequest } from '../../../fetch/fetch-client';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { dailyEntriesSignal } from '../../../signals';
import { StrapiQueryObject, formatDate, genericConverter } from '../../../utilities';
import { TimeCaptureDialogContent } from './TimeCaptureDialogContent';
import { dailyEntrySignal, initilDailyEntry, workEntrySignal } from './timeCaptureSignals';
import { checkWorkEntry, toDailyEntry, toWorkEntry } from './timeCaptureUtils';

export function TimeCaptureFlow() {
  const user = useCurrentUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const severity = useRef<AlertColor>('error');
  const alertMessage = useRef('');

  if (!user) {
    return null;
  }

  const onSuccess = (res: any) => {
    const converted = genericConverter<DailyEntry>(res.data);
    dailyEntriesSignal.value = [...dailyEntriesSignal.value, converted];
    severity.current = 'success';
    alertMessage.current = 'Zeiten erfolgreich gespeichert';

    setOpenSnackbar(true);
    setDialogOpen(false);
    dailyEntrySignal.value = initilDailyEntry;
  };

  const isEntryExists = async () => {
    const queryObject: StrapiQueryObject = {
      filters: {
        tenant: user?.tenant,
        username: {
          $eq: user?.username,
        },
        date: {
          $eq: dailyEntrySignal.value.date,
        },
      },
    };
    return loadDailyEntries(queryObject).then((res) => {
      if (res.meta.pagination.total > 0) {
        throw new Error(
          `Für den Tag ${formatDate(
            dailyEntrySignal.value.date,
          )} wurde die Zeit bereits erfasst. Ändere das Datum oder lösche den Eintrag`,
        );
      }
      return false;
    });
  };

  const persistWorkEntry = async (): Promise<WorkEntry> => {
    const we: WorkEntry = toWorkEntry({
      workEntryStub: workEntrySignal.value,
      tenant: user.username,
      username: user.username,
      date: dailyEntrySignal.value.date,
    });
    return appRequest('post')('work-entries', {
      data: we,
    }).then((res) => genericConverter<WorkEntry>(res.data));
  };

  const saveRequest = async () => {
    try {
      await isEntryExists();
      let workEntry: WorkEntry | undefined = undefined;

      if (dailyEntrySignal.value.type === 'Arbeit') {
        if (checkWorkEntry(workEntrySignal.value)) {
          workEntry = await persistWorkEntry();
        }
      }

      const dailyEntry = toDailyEntry({
        date: dailyEntrySignal.value.date,
        sum: workEntry?.hours || DEFAULT_HOURS,
        tenant: user.tenant,
        username: user.username,
        type: dailyEntrySignal.value.type,
        work_entries: workEntry ? [workEntry.id as number] : undefined,
      });

      await appRequest('post')('daily-entries', { data: dailyEntry }).then(onSuccess);
    } catch (e: any) {
      const errorString = e.toString();
      severity.current = 'error';
      alertMessage.current = errorString.split(': ')[1];

      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <AddFab onClick={() => setDialogOpen(true)} />
      <AppDialog
        title="Zeit erfassen"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={saveRequest}
        confirmDisabled={false}
      >
        <TimeCaptureDialogContent />
      </AppDialog>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={severity.current}>{alertMessage.current}</Alert>
      </Snackbar>
    </>
  );
}
