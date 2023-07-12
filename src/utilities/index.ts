import qs from 'qs';

export function euroValue(value: string | number | undefined) {
  if (typeof value == 'undefined' || value === '') {
    return '';
  }

  let toFormat = value;
  if (typeof value == 'string') {
    toFormat = value.replace(',', '.');
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(toFormat));
}

export const genericConverter = <T>(entry: any) => {
  return {
    id: entry.id,
    ...entry.attributes,
  } as T;
};

export function getCurrentDBDate() {
  return new Date().toISOString().split('T')[0];
}

export function getMonthStart(offset = 0) {
  const date = new Date();
  let month = date.getMonth() + offset;
  let year = date.getFullYear();
  if (month < 0) {
    month = 11;
    year = year - 1;
  }

  const dbMonth = String(month + 1).padStart(2, '0');
  return `${year}-${dbMonth}-01`;
}

export function buildQuery(queryObj: object) {
  return qs.stringify(queryObj);
}

export function getColor(type: DailyEntryType) {
  switch (type) {
    case 'Krank':
      return 'error';
    case 'Urlaub':
      return 'warning';
    case 'Schule':
      return 'primary';
    default:
      return 'inherit';
  }
}
