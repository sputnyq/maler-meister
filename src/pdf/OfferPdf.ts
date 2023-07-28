import { euroValue } from '../utilities';
import PdfBuilder from './PdfBuilder';

interface CreateOfferParams {
  offer: AppOffer;
  //   printSettings: PrintSettings;
}

export function createOfferPdf(payload: CreateOfferParams) {
  const { offer } = payload;

  const filename = generateFileName(offer);

  const builder = new PdfBuilder(filename, {
    left: 20,
    right: 15,
    top: 10,
    bottom: 10,
  });

  addOfferNumber(builder, offer);
  builder.addSpace(10);
  addServices(builder, offer);

  builder.save();
}

function offerId(offer: AppOffer) {
  const { id, createdAt } = offer;
  const date = new Date(createdAt);
  return `${date.getFullYear()}-${monthToPrint(date)}.${id}`;
}

function addServices(builder: PdfBuilder, offer: AppOffer) {
  const body = offer.offerServices.map((serv, index) => {
    return [
      index + 1,
      serv.name,
      serv.quantity || '',
      serv.unit || '',
      euroValue(serv.unitPrice),
      euroValue(serv.netto),
    ];
  });
  builder.addTable([['Pos', 'Bezeichnung Leistung', 'Menge', '', 'E-Preis', 'Gesamt']], body);
}

function addOfferNumber(builder: PdfBuilder, offer: AppOffer) {
  const text = `Angebot Nr. ${offerId(offer)} `;
  builder.addText(text, 10, 10, 'right');
}

function monthToPrint(date: Date) {
  return String(date.getMonth() + 1).padStart(2, '0');
}

function generateFileName(offer: AppOffer): string {
  let name = offerId(offer);

  const { company, lastName } = offer;

  if (company) {
    name = name.concat(` ${company}`);
  }
  if (lastName) {
    name = name.concat(` ${lastName}`);
  }

  return name.concat('.pdf');
}
