import { useEffect, useState } from 'react';

export function useHolidays(year: number | string | undefined) {
  const [holidays, setHolidays] = useState<Feiertag[]>([]);

  useEffect(() => {
    const _year = year ? year : new Date().getFullYear();
    const itemName = `holidays-${_year}`;
    const stored = localStorage.getItem(itemName);
    if (stored !== null) {
      setHolidays(JSON.parse(stored));
    } else {
      fetch(`https://get.api-feiertage.de?years=${_year}&states=by`, { method: 'get' })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            setHolidays(data.feiertage);
            localStorage.setItem(itemName, JSON.stringify(data.feiertage));
          }
        })
        .catch(console.log);
    }
  }, [year]);

  return holidays as Feiertag[];
}
