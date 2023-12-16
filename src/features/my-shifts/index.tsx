import { useEffect, useState } from 'react';

import { ColFlexBox } from '../../components/ColFlexBox';
import { loadShifts } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { StrapiQueryObject } from '../../utilities';
import { MyShiftRenderer } from './MyShiftRenderer';

import { addDays, formatISO } from 'date-fns';

export function MyShifts() {
  const user = useCurrentUser();

  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const queryObj: StrapiQueryObject = {
      filters: {
        tenant: user?.tenant,
        start: {
          $gte: formatISO(new Date(), { representation: 'date' }),
          $lte: formatISO(addDays(new Date(), 5), { representation: 'date' }),
        },
      },
    };

    loadShifts(queryObj).then((res) => {
      if (res) {
        setShifts(res.shifts);
      }
    });
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <ColFlexBox>
      {shifts
        .filter((shift) => isMyShift(shift, user.username))
        .map((shift) => (
          <MyShiftRenderer key={shift.id} shift={shift} />
        ))}
    </ColFlexBox>
  );
}

const isMyShift = (shift: Shift, username: string) =>
  shift.constructionsPlan.some((cp) => cp.usernames.includes(username));
