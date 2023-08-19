import PdfBuilder, { Margin } from './PdfBuilder';
import {
  HEADER_COLOR,
  TEXT_COLOR,
  addBancAccount,
  addCustomer,
  addDate,
  addHeader,
  addLogo,
  addServices,
  addText,
} from './shared';

interface CreateOfferPdfParams {
  offer: AppOffer;
  printSettings: PrintSettings;
  construction?: Construction;
  type: string;
}

export function createOfferPdf(payload: CreateOfferPdfParams) {
  const { offer, printSettings, construction, type } = payload;

  const filename = generateOfferFileName(offer);

  const margin: Margin = {
    left: 20,
    right: 15,
    top: 10,
    bottom: 15,
  };

  const builder = new PdfBuilder(filename, margin, TEXT_COLOR, HEADER_COLOR);

  addLogo(builder, printSettings, margin);

  addHeader(builder, printSettings);
  addCustomer(builder, offer);
  addDate(builder, offer);
  addOfferNumber(builder, offer, type);
  addConstruction(builder, construction);
  addText(builder, printSettings.textBefore);
  addServices(builder, offer.offerServices);

  addText(builder, offer.text);

  addText(builder, printSettings.textAfter);

  addBancAccount(builder, printSettings);

  builder.enumeratePages([offerId(offer)]);

  builder.save();
}

function addConstruction(builder: PdfBuilder, construction?: Construction) {
  if (!construction) {
    return;
  }
  const dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' });
  const range = dateFormatter.formatRange(new Date(construction.start), new Date(construction.end));
  builder.addTable(
    [{ a: '', b: '' }],
    [
      ['B.V.', construction.name],
      ['Ausführungszeitraum', range],
    ],
    {
      a: { fontStyle: 'bold', textColor: HEADER_COLOR, cellWidth: 130 },
      b: { halign: 'left' },
    },
  );
}

function offerId(offer: AppOffer) {
  const { id, createdAt } = offer;
  const date = new Date(createdAt);
  return `${date.getFullYear()}-${monthToPrint(date)}.${id}`;
}

function addOfferNumber(builder: PdfBuilder, offer: AppOffer, type: string) {
  builder.addSpace(25);

  const text = `${type} # ${offerId(offer)}`;

  builder.header1(text);
}

function monthToPrint(date: Date) {
  return String(date.getMonth() + 1).padStart(2, '0');
}

function generateOfferFileName(offer: AppOffer): string {
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
