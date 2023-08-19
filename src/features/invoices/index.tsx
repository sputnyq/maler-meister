import { Link } from 'react-router-dom';

import AddFab from '../../components/AddFab';
import { InvoicesGrid } from './InvoicesGrid';

export default function Invoices() {
  return (
    <>
      <InvoicesGrid />
      <Link to="-1">
        <AddFab />
      </Link>
    </>
  );
}
