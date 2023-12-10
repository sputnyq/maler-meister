import { Grid, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useSelector } from 'react-redux';

import { AppDialog } from '../../../components/AppDialog';
import AppGrid from '../../../components/AppGrid';
import { ColFlexBox } from '../../../components/ColFlexBox';
import { loadConstructions } from '../../../fetch/api';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { AppState } from '../../../store';
import { AvailableWorker } from './AvailableWorker';
import { ConstructionPlanCard } from './ConstructionPlan';

import { DateSelectArg } from '@fullcalendar/core';
import { formatISO } from 'date-fns';

interface Props {
  open: boolean;
  onClose(): void;
  id?: string | number;
  dateSelectArg?: DateSelectArg | null;
}

const formatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: '2-digit',
  year: '2-digit',
  month: '2-digit',
});

export function ShiftPlanDialog({ open, onClose, id, dateSelectArg }: Readonly<Props>) {
  const user = useCurrentUser();

  const [shift, setShift] = useState<Shift | null>(null);

  useEffect(() => {
    if (id) {
      console.log('test');
    } else if (dateSelectArg) {
      const { start } = dateSelectArg;
      const queryObj = {
        filters: {
          tenant: user?.tenant,
          start: {
            $lte: formatISO(start, { representation: 'date' }),
          },
          end: {
            $gte: formatISO(start, { representation: 'date' }),
          },
        },
        pagination: {
          pageSize: 100,
        },
      };

      loadConstructions(queryObj).then((res) => {
        if (res) {
          const nextShift = {
            constructionsPlan: new Array<ConstructionPlan>(),
            date: formatISO(start, { representation: 'date' }),
          } as Shift;

          res.constructions
            .filter((c) => c.active && c.confirmed)
            .forEach(({ id, name, allocatedPersons }) => {
              nextShift.constructionsPlan.push({ id, name, allocatedPersons, usernames: [] });
            });
          setShift(nextShift);
        }
      });
    }
  }, [id, dateSelectArg, user?.tenant]);

  const date = shift?.date ? formatter.format(new Date(shift.date)) : '';

  return (
    <AppDialog title={`Einsatzplan ${date}`} open={open} onClose={onClose}>
      {shift === null ? <Typography>Loading</Typography> : <ShiftPlanEdit initial={shift} key={shift.date} />}
    </AppDialog>
  );
}

interface ShiftPlanEditProps {
  initial: Shift;
}

function ShiftPlanEdit({ initial }: ShiftPlanEditProps) {
  const [shift, setShift] = useState(initial);
  const users = useSelector<AppState, User[]>((s) => s.users.all);

  const isAvailable = (user: User) => !shift.constructionsPlan.some((cp) => cp.usernames.includes(user.username));
  const availableWorkers = users.filter(isAvailable);

  const onDrop = (username: string, cid: number) => {
    const nextShift = { ...shift };
    const entry = nextShift.constructionsPlan.find((cp) => Number(cp.id) === Number(cid));
    if (entry) {
      entry.usernames.push(username);
      setShift((s) => ({ ...s, ...nextShift }));
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

  return (
    <ColFlexBox pt={1}>
      <Typography variant="h4">{formatter.format(new Date(shift.date))}</Typography>
      <AppGrid p={1}>
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
            <ColFlexBox mt={1}>
              {availableWorkers.map((user) => (
                <AvailableWorker key={user.username} user={user} />
              ))}
            </ColFlexBox>
          </Grid>
        </DndProvider>
      </AppGrid>
    </ColFlexBox>
  );
}
