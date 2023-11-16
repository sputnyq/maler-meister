interface BgbService {
  id: number;
  name: string;
  unit: string;
  taxRate: number;
  unitPrice: number;
  jobId: number;
  description: string;
}

interface OfferService extends BgbService {
  netto: number;
  quantity: number;
  taxValue: number;
  brutto: number;
}

interface AppOffer {
  id: number;
  company: string;
  salutation: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  offerServices: OfferService[];
  text: string;
  constructionId: number;
  createdAt: string;
  updatedAt: string;
}

interface AppInvoice extends AppOffer {
  offerId: number;
}

interface LoginResponse {
  jwt: string;
  user: User;
}

type UserRole = 'admin' | 'worker' | 'accountant';

interface User {
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  userRole: UserRole;
  firstName: string;
  lastName: string;
  tenant: string;
}

type DailyEntryType = 'Arbeit' | 'Urlaub' | 'Krank' | 'Schule' | 'Feiertag';

interface Construction {
  id: number;
  name: string;
  active: boolean;
  tenant: string;
  confirmed: boolean;
  start: any;
  end: any;
  allocatedPersons: number;
}
interface WorkEntry {
  id?: number;
  date: string;
  constructionId: number;
  username: string;
  hours: string;
  job: string;
  jobId: number;
  tenant: string;
}
interface DailyEntry {
  id?: number;
  date: string;
  sum: number;
  overload: number;
  underload: number;
  username: string;
  type: DailyEntryType;
  work_entries?: WorkEntry[] | number[];
  tenant: string;
}

interface AppJob {
  id: number;
  tenant: string;
  name: string;
  position: number;
}

interface Feiertag {
  date: string;
  fname: string;
  comment: string;
}

interface AppDateRange {
  start?: string;
  end?: string;
}

interface ApiMeta {
  pagination: Pagination;
}

interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface PrintSettingsRoot {
  id: number;
  tenant: string;
  name: string;
  settings: PrintSettings;
}

interface PrintSettings {
  ownerName: string;
  taxNumber: string;
  companyName: string;

  addressStreet: string;
  addressNumber: string;
  addressZip: string;
  addressCity: string;

  phone: string;
  mobile: string;
  fax: string;
  email: string;
  web: string;

  bank: string;
  iban: string;
  bic: string;

  logoUrl: string;
  logoHeight: number;
  logoWidth: number;

  textBefore: string;
  textAfter: string;

  invoiceTextBefore: string;
  invoiceTextAfter: string;

  primaryColor: string;
  highlightColor: string;
  font: SupportedFonts;
}

type SupportedFonts = 'Courier' | 'Helvetica' | 'Times';

type EventDateRange = {
  start?: Date;
  end?: Date;
};
