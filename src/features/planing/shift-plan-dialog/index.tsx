import { useEffect, useState } from 'react';

import { AppDialog } from '../../../components/AppDialog';
import { loadConstructions, loadShiftById } from '../../../fetch/api';
import { shiftById } from '../../../fetch/endpoints';
import { appRequest } from '../../../fetch/fetch-client';
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
      loadShiftById(id).then((res) => {
        if (res) {
          setShift(res);
        }
      });
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
            tenant: user?.tenant,
            constructionsPlan: new Array<ConstructionPlan>(),
            start: dateSelectArg.startStr,
            end: dateSelectArg.endStr,
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

  const onCloseRequest = () => {
    setShift(null);
    onClose();
  };

  const onConfirm = () => {
    appRequest(shift?.id ? 'put' : 'post')(shiftById(shift?.id || ''), {
      data: shift,
    })
      .catch((e) => {
        console.log(e);
        alert('Fehler beim speichern!');
      })
      .finally(onCloseRequest);
  };

  const onDelete = shift?.id ? () => {} : undefined;

  return (
    <AppDialog title="Schichtplanung" open={open} onClose={onCloseRequest} onConfirm={onConfirm} onDelete={onDelete}>
      {shift === null ? <LoadingScreen /> : <ShiftPlanEdit shift={shift} setShift={setShift} />}
    </AppDialog>
  );
}
