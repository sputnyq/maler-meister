interface AppService {
  description: string;
  unit: string;
  taxRate: number;
  unitPrice: number;
}

interface OfferService extends AppService {
  netto: number;
  quantity: number;
  taxValue: number;
  brutto: number;
}

interface Offer {
  company: string;
  salutation: string;
  firstName: string;
  lastname: string;
  tel: string;
  email: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  offerServices: OfferService[];
  text: string;
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

type ISOString = string;

type DailyEntryType = 'Arbeit' | 'Urlaub' | 'Krank' | 'Schule';

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
  tenant: string;
  name: string;
  id: number;
}

interface Feiertag {
  date: string;
  fname: string;
  comment: string;
}

interface AppDateTange {
  start?: string;
  end?: string;
}
