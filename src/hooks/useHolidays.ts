import { useEffect } from 'react';

import { useLocalStorage } from './useLocalStorage';

export function useHolidays(year: number | string) {
  const [holidays, setHolidays] = useLocalStorage<Feiertag[]>(`holidays-${year}`, '[]');

  useEffect(() => {
    if (holidays.length === 0) {
      fetch(`https://get.api-feiertage.de?years=${year}&states=by`, { method: 'get' })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            //@ts-ignore
            setHolidays(data.feiertage);
          }
        })
        .catch(console.log);
    }
  }, [holidays, year, setHolidays]);

  return holidays as Feiertag[];
}
