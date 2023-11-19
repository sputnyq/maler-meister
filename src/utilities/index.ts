import { Theme } from '@mui/material';

import { formatISO } from 'date-fns';
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

type Filters = {
  tenant: string | undefined;
  [key: string]: any;
};

export type StrapiQueryObject = {
  filters: Filters;
  sort?: object;
  pagination?: object;
};
export function buildQuery(queryObj: StrapiQueryObject) {
  return qs.stringify(queryObj);
}

export function getColorHex(type: DailyEntryType, theme: Theme) {
  const { palette } = theme;
  const themeProp = getJobColor(type);

  return palette[themeProp].main;
}

export function getJobColor(type: DailyEntryType) {
  switch (type) {
    case 'Krank':
      return 'error';
    case 'Schule':
      return 'success';
    case 'Arbeit':
      return 'primary';
    case 'Feiertag':
      return 'secondary';
    case 'Urlaub':
      return 'warning';
  }
}

export function calculatePriceSummary(offerServices: OfferService[]) {
  const netto = offerServices.reduce((prev, os) => {
    return prev + Number(os.netto || 0);
  }, 0);

  const tax = offerServices
    .filter((os) => os.taxRate > 0)
    .reduce((prev, os) => {
      return prev + Number(os.taxValue || 0);
    }, 0);

  const brutto = netto + tax;

  return { brutto, tax, netto };
}

export const isHoliday = (date: Date, feiertage: Feiertag[]) => {
  const asString = formatISO(date, { representation: 'date' });
  return feiertage.some((h) => h.date === asString);
};

export const isWeekend = (date: Date) => {
  const result = date.getDay() === 0 || date.getDay() === 6;

  return result;
};

export function userFullName(user: User) {
  return `${user.lastName}, ${user.firstName}`;
}

export const formatDate = (date: string | Date | null) => {
  if (date === null) return '';
  const f = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'numeric', year: '2-digit' });
  if (typeof date === 'string') {
    return f.format(new Date(date));
  }
  return f.format(date);
};

export const formatNumber = (nmb: string | number) => {
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(Number(nmb));
};
