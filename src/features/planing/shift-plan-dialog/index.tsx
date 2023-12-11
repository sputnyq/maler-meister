import { useEffect, useState } from 'react';

import { AppDialog } from '../../../components/AppDialog';
import { loadConstructions } from '../../../fetch/api';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { LoadingScreen } from '../../app-structure/LoadingScreen';
import { ShiftPlanEdit } from './ShiftPlanEdit';

import { DateSelectArg } from '@fullcalendar/core';
import { formatISO } from 'date-fns';

interface Props {
  open: boolean;
  onClose(): void;
  id?: string | number;
  dateSelectArg?: DateSelectArg | null;
}

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

  return (
    <AppDialog title="Schichtplanung" open={open} onClose={onClose} showConfirm onConfirm={console.log}>
      {shift === null ? <LoadingScreen /> : <ShiftPlanEdit shift={shift} setShift={setShift} />}
    </AppDialog>
  );
}
