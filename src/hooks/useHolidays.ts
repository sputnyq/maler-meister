import { useEffect } from 'react';

import { appRequest } from '../fetch/fetch-client';
import { useLocalStorage } from './useLocalStorage';

const holidaysUrl = (year: number | string) => `https://get.api-feiertage.de?years=${year}&states=by`;

export function useHolidays(year: number | string) {
  const [holidays, setHolidays] = useLocalStorage<any[]>(`holidays-${year}`, []);

  useEffect(() => {
    if (holidays.length === 0) {
      appRequest('get')(holidaysUrl(year)).then((res) => {
        console.log(res);
      });
    }
  }, [holidays, year]);
}
