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
