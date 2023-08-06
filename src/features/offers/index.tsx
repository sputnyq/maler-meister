import { Link } from 'react-router-dom';

import AddFab from '../../components/AddFab';
import OffersGrid from './OffersGrid';

export default function Offers() {
  return (
    <>
      <OffersGrid />
      <Link to="-1">
        <AddFab />
      </Link>
    </>
  );
}
