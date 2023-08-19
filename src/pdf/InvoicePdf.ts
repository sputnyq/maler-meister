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

interface CreateInvoicePdfParams {
  invoice: AppInvoice;
  printSettings: PrintSettings;
  construction?: Construction;
}
export function createInvoicePdf(payload: CreateInvoicePdfParams) {
  const { invoice, printSettings } = payload;

  const filename = generateInvoiceFileName(invoice);

  const margin: Margin = {
    left: 20,
    right: 15,
    top: 10,
    bottom: 15,
  };

  const builder = new PdfBuilder(filename, margin, TEXT_COLOR, HEADER_COLOR);

  addLogo(builder, printSettings, margin);
  addHeader(builder, printSettings);
  addCustomer(builder, invoice);
  addDate(builder, invoice);
  addInvoiceNumber(builder, invoice);
  addText(builder, printSettings.invoiceTextBefore);
  addServices(builder, invoice.offerServices);

  addText(builder, invoice.text);

  addText(builder, printSettings.invoiceTextAfter);

  addBancAccount(builder, printSettings);

  builder.enumeratePages([`${invoice.id}`]);
  builder.save();
}

function generateInvoiceFileName(invoice: AppInvoice): string {
  let name = String(invoice.id);

  const { company, lastName } = invoice;

  if (company) {
    name = name.concat(` ${company}`);
  }
  if (lastName) {
    name = name.concat(` ${lastName}`);
  }

  return name.concat('.pdf');
}

function addInvoiceNumber(builder: PdfBuilder, invoice: AppInvoice) {
  builder.addSpace(25);

  const text = `Rechnung Nr. ${invoice.id}`;

  builder.header1(text);
}
