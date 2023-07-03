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

type UserRole = "admin" | "worker" | "accountant";

interface User {
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  userRole: UserRole;
}

type DailyEntryType = "Arbeit" | "Urlaub" | "Krank";

interface Construction {
  id: number;
  name: string;
  active: boolean;
}
interface WorkEntry {
  constructionName: string;
  hours: string;
  job: string;
}
interface DailyEntry {
  date: any;
  sum?: number;
  username: string;
  type: DailyEntryType;
  workEntries?: WorkEntry[];
}

interface AppJob {
  name: string;
  id: number;
}
