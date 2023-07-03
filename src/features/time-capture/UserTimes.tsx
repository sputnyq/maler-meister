import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { appRequest } from '../../fetch/fetch-client';
import { AppState } from '../../store';
import { getMonthStart } from '../../utils';

import * as qs from 'qs';

export default function UserTimes() {
  const [monthValue, setMonthValue] = useState<'current' | 'last'>('current');
  const username = useSelector<AppState, string | undefined>((s) => s.login.user?.username);

  useEffect(() => {
    const filtersObj: any = {
      username: {
        $eq: username,
      },
    };
    if (monthValue === 'current') {
      filtersObj.date = {
        $gte: getMonthStart(),
      };
    } else {
      filtersObj.date = {
        $gte: getMonthStart(-1),
        $lt: getMonthStart(),
      };
    }

    const query = qs.stringify({ filters: filtersObj });

    appRequest('get')(`daily-entries?${query}`).then((res) => {
      console.log(res.data);
    });
  }, [username, monthValue]);

  return (
    <Box>
      <ToggleButtonGroup
        fullWidth
        exclusive
        value={monthValue}
        onChange={(_, value) => {
          value && setMonthValue(value);
        }}
      >
        <ToggleButton size="small" value="last">
          Letzter Monat
        </ToggleButton>
        <ToggleButton size="small" value="current">
          Laufender Monat
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
