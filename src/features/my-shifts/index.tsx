import { useEffect, useState } from 'react';

import { ColFlexBox } from '../../components/ColFlexBox';
import { Wrapper } from '../../components/Wrapper';
import { loadShifts } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { StrapiQueryObject } from '../../utilities';
import { MyShiftRenderer } from './MyShiftRenderer';

import { formatISO } from 'date-fns';

export function MyShifts() {
  const user = useCurrentUser();

  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const queryObj: StrapiQueryObject = {
      filters: {
        tenant: user?.tenant,

        end: {
          $gte: formatISO(new Date(), { representation: 'date' }),
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
    <Wrapper title="Meine Schichten">
      <ColFlexBox>
        {shifts
          .filter((shift) => isMyShift(shift, user.username))
          .map((shift) => (
            <MyShiftRenderer key={shift.id} shift={shift} />
          ))}
      </ColFlexBox>
    </Wrapper>
  );
}

const isMyShift = (shift: Shift, username: string) =>
  shift.constructionsPlan.some((cp) => cp.usernames.includes(username));
