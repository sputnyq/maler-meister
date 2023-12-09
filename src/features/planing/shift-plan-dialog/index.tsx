import { Grid, Typography } from '@mui/material';

import React, { useEffect, useState } from 'react';
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
import { cloneDeep } from 'lodash';

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
      {shift === null ? <Typography>Loading</Typography> : <ShiftPlanEdit initial={shift} />}
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

  const drag = (ev: React.DragEvent<HTMLDivElement>, username: string) => {
    ev.dataTransfer.setData('username', username);
  };

  const drop: React.DragEventHandler<HTMLElement> = (ev) => {
    ev.preventDefault();
    const username = ev.dataTransfer.getData('username');
    const cid = ev.currentTarget.getAttribute('data-cid');

    const nextShift = cloneDeep(shift);

    const entry = nextShift.constructionsPlan.find((pe) => Number(pe.id) === Number(cid));
    if (entry) {
      entry.usernames.push(username);
      setShift(nextShift);
    }
  };

  const onDelete = (username: string) => {
    const nextShift = cloneDeep(shift);

    const cp = nextShift.constructionsPlan.find((cp) => cp.usernames.includes(username));
    if (cp) {
      cp.usernames = cp.usernames.filter((u) => u !== username);
      setShift(nextShift);
    }
  };

  return (
    <ColFlexBox pt={1}>
      <Typography variant="h4">{formatter.format(new Date(shift.date))}</Typography>
      <AppGrid p={1}>
        <Grid item xs={6}>
          <ColFlexBox>
            {shift.constructionsPlan.map((cp) => (
              <ConstructionPlanCard onDelete={onDelete} constructionPlan={cp} drop={drop} />
            ))}
          </ColFlexBox>
        </Grid>
        <Grid item xs={6}>
          <ColFlexBox mt={1}>
            {availableWorkers.map((user) => (
              <AvailableWorker user={user} onDragStart={(ev) => drag(ev, user.username)} />
            ))}
          </ColFlexBox>
        </Grid>
      </AppGrid>
    </ColFlexBox>
  );
}
