import PdfBuilder, { Margin } from './PdfBuilder';
import {
  addBancAccount,
  addConstruction,
  addCustomer,
  addDate,
  addDocumentNumber,
  addHeader,
  addLogo,
  addServices,
  addText,
  buildDocId,
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

  const builder = new PdfBuilder(
    filename,
    margin,
    printSettings.primaryColor || '#000',
    printSettings.highlightColor || '#000',
    printSettings.font,
  );

  addLogo(builder, printSettings, margin);

  addHeader(builder, printSettings);
  addCustomer(builder, offer);
  addDate(builder, offer);
  addDocumentNumber(builder, offer, type);
  addConstruction(builder, printSettings.highlightColor, construction);
  addText(builder, printSettings.textBefore);
  addServices(builder, offer.offerServices);

  addText(builder, offer.text);

  addText(builder, printSettings.textAfter);

  addBancAccount(builder, printSettings);

  builder.enumeratePages([buildDocId(offer)]);

  builder.save();
}

function generateOfferFileName(offer: AppOffer): string {
  let name = buildDocId(offer);

  const { company, lastName } = offer;

  if (company) {
    name = name.concat(` ${company}`);
  }
  if (lastName) {
    name = name.concat(` ${lastName}`);
  }

  return name.concat('.pdf');
}
