import { calculatePriceSummary, euroValue } from '../utilities';
import PdfBuilder from './PdfBuilder';

interface CreateOfferParams {
  offer: AppOffer;
  printSettings: PrintSettings;
}

export function createOfferPdf(payload: CreateOfferParams) {
  const { offer, printSettings } = payload;

  const filename = generateFileName(offer);

  const builder = new PdfBuilder(filename, {
    left: 20,
    right: 15,
    top: 10,
    bottom: 15,
  });

  addHeader(builder, printSettings);
  addOfferNumber(builder, offer);
  addServices(builder, offer);
  addPrice(builder, offer);

  builder.enumeratePages([offerId(offer)]);

  builder.save();
}

function addHeader(builder: PdfBuilder, printSettings: PrintSettings) {
  builder.header2(printSettings.companyName);
  const left = [
    printSettings.ownerName,
    `${printSettings.addressStreet} ${printSettings.addressNumber}`,
    `${printSettings.addressZip} ${printSettings.addressCity}`,
    printSettings.web,
  ];

  const right = [];

  printSettings.phone && right.push(`Tel: ${printSettings.phone}`);
  printSettings.mobile && right.push(`Mobil: ${printSettings.mobile}`);
  printSettings.fax && right.push(`Fax: ${printSettings.fax}`);
  printSettings.email && right.push(`E-Mail: ${printSettings.fax}`);
  builder.addLeftRight(left, right, 9);
}

function offerId(offer: AppOffer) {
  const { id, createdAt } = offer;
  const date = new Date(createdAt);
  return `${date.getFullYear()}-${monthToPrint(date)}.${id}`;
}

function addServices(builder: PdfBuilder, offer: AppOffer) {
  const head = [{ a: 'Pos', b: 'Bezeichnung Leistung', c: 'Menge', d: '', e: 'E-Preis', f: 'Gesamt' }];

  const body = [];
  for (let i = 0; i < offer.offerServices.length; i++) {
    const serv = offer.offerServices[i];
    const line = [
      i + 1,
      serv.name,
      serv.quantity || '',
      serv.unit || '',
      euroValue(serv.unitPrice),
      euroValue(serv.netto),
    ];
    body.push(line);
    if (serv.description) {
      body.push(['', serv.description, '', '', '', '']);
    }
  }

  builder.addTable(head, body, {
    b: { cellWidth: 300 },
    c: { cellWidth: 40, halign: 'right' },
    d: { cellWidth: 40 },
    e: { halign: 'right' },
    f: { halign: 'right' },
  });
}

function addOfferNumber(builder: PdfBuilder, offer: AppOffer) {
  builder.addSpace();

  const date = new Date(offer.updatedAt);
  builder.addText(`Datum: ${new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(date)}`, 9, 9, 'right');

  const text = `Angebot # ${offerId(offer)}`;

  builder.addSpace();
  builder.header1(text);
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

function addPrice(builder: PdfBuilder, offer: AppOffer) {
  builder.addLine();
  builder.addSpace();
  const prices = calculatePriceSummary(offer.offerServices);

  builder.addLeftRight(
    ['Angebotssumme Netto', 'Zzgl MwSt 19%', 'Angebotssumme Brutto'],
    [euroValue(prices.netto), euroValue(prices.tax), euroValue(prices.brutto)],
  );
}
