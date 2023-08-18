interface CreateInvoicePdfParams {
  invoice: AppInvoice;
  printSettings: PrintSettings;
  construction?: Construction;
}
export function createInvoicePdf(payload: CreateInvoicePdfParams) {
  alert('kommt bald!');

  console.log(payload);
}
