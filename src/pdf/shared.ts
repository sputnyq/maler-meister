import { calculatePriceSummary, euroValue, numberValue } from '../utilities';
import PdfBuilder, { Margin } from './PdfBuilder';

const NON_REGULAR_SPACES = /[\u00A0\u1680\u180e\u2000\u2009\u200a\u200b\u202f\u205f\u3000]/g;

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
  const head = [
    {
      pos: 'Pos',
      desc: 'Bezeichnung Leistung',
      quantity: 'Menge',
      price: {
        content: 'E-Preis',
        styles: {
          halign: 'right',
        },
      },
      sum: {
        content: 'Gesamt',
        styles: {
          halign: 'right',
        },
      },
    },
  ];

  const emptyLine = ['', '', '', '', ''];

  const body = [];
  for (let i = 0; i < offerServices.length; i++) {
    const serv = offerServices[i];
    const serviceLine = {
      pos: serv.name ? i + 1 : '',
      desc: serv.name,
      quantity: numberValue(serv.quantity).concat(` ${serv.unit || ''}`),
      price: euroValue(serv.unitPrice),
      sum: euroValue(serv.netto),
    };

    body.push(serviceLine);
    if (serv.description) {
      body.push(['', serv.description, '', '', '']);
    }

    //space between
    body.push(emptyLine);
  }
  body.push(...[emptyLine, emptyLine]);

  const prices = calculatePriceSummary(offerServices);

  body.push(['', 'Netto', '', '', euroValue(prices.netto)]);
  body.push(['', 'Zzgl MwSt 19%', '', '', euroValue(prices.tax)]);
  body.push(['', 'Gesamtbetrag', '', '', euroValue(prices.brutto)]);

  builder.addSpace();

  builder.addTable(head, body, {
    desc: { cellWidth: 280 },
    price: { halign: 'right' },

    sum: { halign: 'right' },
  });
}

export function addBancAccount(builder: PdfBuilder, printSettings: PrintSettings) {
  builder.addFooterText(`Bankverbindung: ${printSettings.ownerName} | ${printSettings.bank} | ${printSettings.iban}`);
}

export function addText(builder: PdfBuilder, text?: string) {
  builder.addSpace();
  if (!text) {
    return;
  }
  builder.addTable(null, [[text.replaceAll(NON_REGULAR_SPACES, ' ')]]);
}

export function addDocumentNumber(builder: PdfBuilder, doc: AppOffer | AppInvoice, type: string) {
  builder.addSpace(25);

  const text = `${type} Nr. ${buildDocId(doc)}`;

  builder.header1(text);
}

export function buildDocId(doc: AppOffer | AppInvoice) {
  const { id, createdAt } = doc;
  const date = new Date(createdAt);
  return `${date.getFullYear()}-${monthToPrint(date)}.${id}`;
}

export function addConstruction(builder: PdfBuilder, textColor: string, construction?: Construction) {
  if (construction?.start && construction?.end) {
    const dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' });
    const range = dateFormatter
      .formatRange(new Date(construction.start), new Date(construction.end))
      .replaceAll(NON_REGULAR_SPACES, ' ');
    builder.addTable(
      [{ a: '', b: '' }],
      [
        ['B.V.', construction.name],
        ['Ausführungszeitraum', range],
      ],
      {
        a: { fontStyle: 'bold', textColor: textColor, cellWidth: 130 },
        b: { halign: 'left' },
      },
    );
  }
}

function monthToPrint(date: Date) {
  return String(date.getMonth() + 1).padStart(2, '0');
}
