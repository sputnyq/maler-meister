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

export function getJobColor(type: DailyEntryType): any {
  switch (type) {
    case 'Krank':
      return 'error';
    case 'Urlaub':
      return 'warning';
    case 'Schule':
      return 'primary';
    default:
      return 'default';
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
