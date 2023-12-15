import { Box, Divider, Grid, Typography } from '@mui/material';

import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import AppGrid from '../../../components/AppGrid';
import { ColFlexBox } from '../../../components/ColFlexBox';
import { useWorkers } from '../../../hooks/useWorkers';
import { userFullName } from '../../../utilities';
import { AvailableWorker } from './AvailableWorker';
import { ConstructionPlanCard } from './ConstructionPlan';

import { isAfter, isBefore } from 'date-fns';

interface Props {
  shift: Shift;
  setShift(shift: Shift): void;
  dailyEntries: DailyEntry[];
}

const formatter = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });

const workerAvailbale = (args: { user: User; dailyEntries: DailyEntry[]; shift: Shift }) => {
  const { user, dailyEntries, shift } = args;

  const relevantDEs = dailyEntries.filter((de) => de.username === user.username);
  if (relevantDEs.length === 0) {
    return true;
  }

  return relevantDEs.some((de) => {
    const deDate = new Date(de.date);
    if (isAfter(deDate, new Date(shift.start)) && isBefore(deDate, new Date(shift.end))) {
      return false;
    }
  });
};

export function ShiftPlanEdit({ shift, setShift, dailyEntries }: Readonly<Props>) {
  const workers = useWorkers();

  const notAllocated = (user: User) => !shift.constructionsPlan.some((cp) => cp.usernames.includes(user.username));
  const availableWorkers = workers
    .filter(notAllocated)
    .filter((user) => workerAvailbale({ user, dailyEntries, shift }));

  const onDrop = (username: string, cid: number) => {
    const nextShift = { ...shift };
    const entry = nextShift.constructionsPlan.find((cp) => Number(cp.id) === Number(cid));
    if (entry) {
      entry.usernames.push(username);
      setShift({ ...shift, ...nextShift });
    }
  };

  const onDelete = (username: string) => {
    const nextShift = { ...shift };
    const entry = nextShift.constructionsPlan.find((cp) => cp.usernames.includes(username));
    if (entry) {
      entry.usernames = entry.usernames.filter((u) => u !== username);
      setShift(nextShift);
    }
  };

  const unavailable = workers.filter((user) => !workerAvailbale({ user, dailyEntries, shift }));

  return (
    <ColFlexBox>
      <Typography variant="h6">{formatter.formatRange(new Date(shift.start), new Date(shift.end))}</Typography>
      <AppGrid>
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
          <Grid item xs={6}>
            <ColFlexBox>
              {shift.constructionsPlan.map((cp) => (
                <ConstructionPlanCard
                  key={cp.id}
                  onDelete={onDelete}
                  constructionPlan={cp}
                  onDrop={(username) => onDrop(username, cp.id)}
                />
              ))}
            </ColFlexBox>
          </Grid>

          <Grid item xs={6}>
            <ColFlexBox>
              {availableWorkers.map((user) => (
                <AvailableWorker key={user.username} user={user} />
              ))}
              <Divider />
              <Typography>Abwesend:</Typography>
              <Box>
                {unavailable.map((user) => (
                  <Typography variant="subtitle2" key={user.username}>
                    {userFullName(user)}
                  </Typography>
                ))}
              </Box>
            </ColFlexBox>
          </Grid>
        </DndProvider>
      </AppGrid>
    </ColFlexBox>
  );
}
