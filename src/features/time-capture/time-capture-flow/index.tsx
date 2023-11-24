import { Alert, AlertColor, Snackbar } from '@mui/material';

import { useRef, useState } from 'react';

import AddFab from '../../../components/AddFab';
import { AppDialog } from '../../../components/AppDialog';
import { DEFAULT_HOURS, INITIAL_DAILY_ENTRY } from '../../../constants';
import { appRequest } from '../../../fetch/fetch-client';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { genericConverter } from '../../../utilities';
import { TimeCaptureDialogContent } from './TimeCaptureDialogContent';
import { checkWorkEntry, isEntryExists, toDailyEntry, toWorkEntry } from './timeCaptureUtils';

interface Props {
  requestUpdate: () => void;
}

export function TimeCaptureFlow({ requestUpdate }: Readonly<Props>) {
  const user = useCurrentUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [dailyEntryStub, setDailyEntryStub] = useState<DailyEntry>(INITIAL_DAILY_ENTRY);
  const [workEntryStub, setWorkEntryStub] = useState<WorkEntryStub>({} as WorkEntryStub);

  const severity = useRef<AlertColor>('error');
  const alertMessage = useRef('');

  if (!user) {
    return null;
  }

  const onSuccess = () => {
    severity.current = 'success';
    alertMessage.current = 'Zeiten erfolgreich gespeichert';

    requestUpdate();
    setOpenSnackbar(true);
    setDialogOpen(false);
    setDailyEntryStub(INITIAL_DAILY_ENTRY);
  };

  const persistWorkEntry = async (): Promise<WorkEntry> => {
    const we: WorkEntry = toWorkEntry({
      workEntryStub,
      tenant: user.tenant,
      username: user.username,
      date: dailyEntryStub.date,
    });
    return appRequest('post')('work-entries', {
      data: we,
    }).then((res) => genericConverter<WorkEntry>(res.data));
  };

  const saveRequest = async () => {
    try {
      await isEntryExists({ tenant: user.tenant, username: user.username, date: dailyEntryStub.date });
      let workEntry: WorkEntry | undefined = undefined;

      if (dailyEntryStub.type === 'Arbeit') {
        if (checkWorkEntry(workEntryStub)) {
          workEntry = await persistWorkEntry();
        }
      }

      const dailyEntry = toDailyEntry({
        date: dailyEntryStub.date,
        sum: workEntry?.hours ?? DEFAULT_HOURS,
        tenant: user.tenant,
        username: user.username,
        type: dailyEntryStub.type,
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

  const setDailyEntryStubValue = (args: { prop: keyof DailyEntry; value: any }) => {
    setDailyEntryStub((cur) => ({ ...cur, [args.prop]: args.value }));
  };

  const setWorkEntryStubValue = (args: { prop: keyof WorkEntryStub; value: any }) => {
    setWorkEntryStub((cur) => ({ ...cur, [args.prop]: args.value }));
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
        <TimeCaptureDialogContent
          setWorkEntryStubValue={setWorkEntryStubValue}
          setDailyEntryStubValue={setDailyEntryStubValue}
          workEntryStub={workEntryStub}
          dailyEntryStub={dailyEntryStub}
        />
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
