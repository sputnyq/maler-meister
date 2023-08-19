import { calculatePriceSummary, euroValue } from '../utilities';
import PdfBuilder, { Margin } from './PdfBuilder';

export const HEADER_COLOR = '#4e4e4e';
export const TEXT_COLOR = '#828282';

export function addLogo(builder: PdfBuilder, printSettings: PrintSettings, margin: Margin) {
  if (!printSettings.logoUrl) {
    return;
  }
  builder.addPngImage(
    printSettings.logoUrl,
    margin.left,
    margin.top,
    printSettings.logoWidth,
    printSettings.logoHeight,
  );
}

export function addHeader(builder: PdfBuilder, printSettings: PrintSettings) {
  const right = [
    printSettings.ownerName,
    `${printSettings.addressStreet} ${printSettings.addressNumber}, ${printSettings.addressZip} ${printSettings.addressCity}`,
  ];

  printSettings.phone && right.push(`Tel: ${printSettings.phone}`);
  printSettings.mobile && right.push(`Mobil: ${printSettings.mobile}`);
  printSettings.fax && right.push(`Fax: ${printSettings.fax}`);
  printSettings.email && right.push(`E-Mail: ${printSettings.email}`);
  printSettings.web && right.push(`${printSettings.web}`);

  right.push(`Steuernummer: ${printSettings.taxNumber}`);

  builder.addLeftRight([], right, 9);
}

export function addCustomer(builder: PdfBuilder, doc: AppOffer | AppInvoice) {
  const left = [];
  if (doc.company) {
    left.push(doc.company);
  }
  left.push(
    ...[
      `${doc.salutation} ${doc.firstName} ${doc.lastName}`,
      `${doc.street} ${doc.number}, ${doc.zip} ${doc.city}`,
      `${doc.phone ? '+'.concat(doc.phone) : ''}${doc.email ? ' | '.concat(doc.email) : ''}`,
    ],
  );

  const right = [];

  while (right.length < left.length) {
    right.push(' ');
  }

  builder.addSpace(25);
  builder.addLeftRight(left, right, 9);
}

export function addDate(builder: PdfBuilder, doc: AppOffer | AppInvoice) {
  const date = new Date(doc.updatedAt);
  builder.addText(`Datum: ${new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(date)}`, 9, 9, 'right');
}

export function addServices(builder: PdfBuilder, offerServices: OfferService[]) {
  const head = [{ a: 'Pos', b: 'Bezeichnung Leistung', c: 'Menge', d: '', e: 'E-Preis', f: 'Gesamt' }];

  const emptyLine = ['', '', '', '', '', ''];

  const body = [];
  for (let i = 0; i < offerServices.length; i++) {
    const serv = offerServices[i];
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

  const prices = calculatePriceSummary(offerServices);

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

export function addBancAccount(builder: PdfBuilder, printSettings: PrintSettings) {
  builder.addFooterText(
    `Konto: ${printSettings.ownerName} | ${printSettings.bank} | ${printSettings.iban} | ${printSettings.bic}`,
  );
}

export function addText(builder: PdfBuilder, text?: string) {
  builder.addSpace();
  if (!text) {
    return;
  }
  builder.addTable(null, [[text]]);
}
