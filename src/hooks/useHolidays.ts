import { useEffect, useState } from 'react';

export function useHolidays(year: number | string) {
  const [holidays, setHolidays] = useState<Feiertag[]>([]);

  useEffect(() => {
    const itemName = `holidays-${year}`;
    const stored = localStorage.getItem(itemName);
    if (stored !== null) {
      setHolidays(JSON.parse(stored));
    } else {
      fetch(`https://get.api-feiertage.de?years=${year}&states=by`, { method: 'get' })
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
