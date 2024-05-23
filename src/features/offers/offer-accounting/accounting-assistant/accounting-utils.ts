import { loadInvoices } from '../../../../fetch/api';
import { invoiceById } from '../../../../fetch/endpoints';
import { appRequest } from '../../../../fetch/fetch-client';
import { calculatePriceSummary } from '../../../../utilities';

/**
 *
 * @param param POSTs an Invoice to the backend
 * @returns
 */
export async function createInvoice(param: { invoice: AppInvoice }) {
  const { invoice } = param;
  try {
    //@ts-ignore
    delete invoice.id;
    const response = await appRequest('post')(invoiceById(''), { data: invoice });
    return response.data.id;
  } catch (e) {
    console.log(e);
    alert('Rechnung konnte nicht erstellt werden.\n Bitte versuche später erneut!');
    return null;
  }
}

type SimpleParam = {
  invoiceType: 'RECHNUNG';
  offer: AppOffer;
};

type FullParam = {
  invoiceType: 'VORAUSZAHLUNG' | 'ABSCHLAGSRECHNUNG' | 'SCHLUSSRECHNUNG';
  vorauszahlungPercent: number;
  services: OfferService[];
  offer: AppOffer;
  tenant: string;
};

type InitInvoiceParam = SimpleParam | FullParam;

/**
 *
 * @param param0 initializes an Invoice
 * @returns
 */
export async function initInvoice(param: InitInvoiceParam): Promise<AppInvoice> {
  const { invoiceType, offer } = param;

  const next: AppInvoice = {
    ...offer,
    invoiceType,

    isPaid: false,
    offerId: offer.id,
  };

  switch (invoiceType) {
    case 'VORAUSZAHLUNG':
      {
        const { vorauszahlungPercent } = param;
        const { brutto, netto, tax } = calculatePriceSummary(offer.offerServices);

        next.offerServices = [
          {
            brutto: brutto * (vorauszahlungPercent / 100),
            name: 'Vorauszahlung',

            taxValue: tax * (vorauszahlungPercent / 100),
            netto: netto * (vorauszahlungPercent / 100),
            taxRate: 19,
          } as OfferService,
        ];
      }
      break;

    case 'ABSCHLAGSRECHNUNG': {
      const { services } = param;
      next.offerServices = services;
      break;
    }

    case 'SCHLUSSRECHNUNG': {
      const { tenant, offer } = param;
      const invoices = await loadInvoices({ filters: { tenant, offerId: offer.id } }).then(
        (res) => res.appInvoices,
      );
      const all = invoices.map((invoice) => invoice.offerServices).flat();
      const { brutto: allBrutto, netto: allNetto, tax: allTax } = calculatePriceSummary(all);
      const {
        brutto: offerBrutto,
        netto: offerNetto,
        tax: offerTax,
      } = calculatePriceSummary(offer.offerServices);

      next.offerServices = [
        ...offer.offerServices,
        {
          brutto: allBrutto - offerBrutto,
          netto: allNetto - offerNetto,
          taxValue: allTax - offerTax,
          name: 'Abzüglich bereits geleisteter Zahlungen',
          taxRate: 19,
        } as OfferService,
      ];
      break;
    }
    default:
      break;
  }

  return next;
}
