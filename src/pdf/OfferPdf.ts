import { calculatePriceSummary, euroValue } from '../utilities';
import PdfBuilder from './PdfBuilder';

interface CreateOfferParams {
  offer: AppOffer;
  printSettings: PrintSettings;
  construction?: Construction;
}

const HEADER_COLOR = '#4e4e4e';
const TEXT_COLOR = '#828282';

export function createOfferPdf(payload: CreateOfferParams) {
  const { offer, printSettings, construction } = payload;

  const filename = generateFileName(offer);

  const builder = new PdfBuilder(
    filename,
    {
      left: 20,
      right: 15,
      top: 10,
      bottom: 15,
    },
    TEXT_COLOR,
    HEADER_COLOR,
  );

  addHeader(builder, printSettings);

  addCustomer(builder, offer);
  addOfferNumber(builder, offer);

  addConstruction(builder, construction);
  addServices(builder, offer);
  // addPrice(builder, offer);

  builder.enumeratePages([offerId(offer)]);

  builder.save();
}

function addCustomer(builder: PdfBuilder, offer: AppOffer) {
  const left = [];
  if (offer.company) {
    left.push(offer.company);
  }
  left.push(
    ...[
      `${offer.salutation} ${offer.firstName} ${offer.lastName}`,
      `${offer.street} ${offer.number}, ${offer.zip} ${offer.city}`,
      `${offer.phone || ''}${offer.email ? ' | '.concat(offer.email) : ''}`,
    ],
  );

  const right = [];

  while (right.length < left.length) {
    right.push('');
  }

  builder.addSpace(25);
  builder.addLeftRight(left, right, 9);
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
  printSettings.email && right.push(`E-Mail: ${printSettings.email}`);

  while (right.length < left.length) {
    right.push('');
  }

  builder.addLeftRight(left, right, 9);
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

function addServices(builder: PdfBuilder, offer: AppOffer) {
  const head = [{ a: 'Pos', b: 'Bezeichnung Leistung', c: 'Menge', d: '', e: 'E-Preis', f: 'Gesamt' }];

  const emptyLine = ['', '', '', '', '', ''];

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
  body.push(emptyLine);

  const prices = calculatePriceSummary(offer.offerServices);

  body.push(['', 'Angebotssumme Netto', '', '', '', euroValue(prices.netto)]);
  body.push(['', 'Zzgl MwSt 19%', '', '', '', euroValue(prices.tax)]);
  body.push(['', 'Angebotssumme Brutto', '', '', '', euroValue(prices.brutto)]);

  builder.addSpace();

  builder.addTable(head, body, {
    b: { cellWidth: 280 },
    c: { cellWidth: 40, halign: 'right' },
    d: { cellWidth: 40 },
    e: { halign: 'right' },
    f: { halign: 'right' },
  });
}

// function addPrice(builder: PdfBuilder, offer: AppOffer) {
//   builder.addLine();
//   builder.addSpace();
//   const prices = calculatePriceSummary(offer.offerServices);

//   builder.addLeftRight(
//     ['Angebotssumme Netto', 'Zzgl MwSt 19%', 'Angebotssumme Brutto'],
//     [euroValue(prices.netto), euroValue(prices.tax), euroValue(prices.brutto)],
//   );
// }

function addOfferNumber(builder: PdfBuilder, offer: AppOffer) {
  builder.addSpace(15);

  const date = new Date(offer.updatedAt);
  builder.addText(`Datum: ${new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(date)}`, 9, 9, 'right');

  const text = `Angebot # ${offerId(offer)}`;

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
