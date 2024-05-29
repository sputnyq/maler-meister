import { fullCustomerName } from '../utilities';

interface Props {
  obj: AppInvoice | AppOffer;
}

export default function CustomerGridCell({ obj }: Readonly<Props>) {
  const { company } = obj;

  const fcn = fullCustomerName(obj);
  if (company) {
    return (
      <>
        <strong>{fcn}</strong> - {company}
      </>
    );
  }
  return <strong>{fcn}</strong>;
}
