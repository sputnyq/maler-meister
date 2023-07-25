import { useNavigate } from 'react-router-dom';

import AddFab from '../components/aa-shared/AddFab';
import OffersGrid from '../features/offers/OffersGrid';

export default function Offers() {
  const navigate = useNavigate();
  return (
    <>
      <OffersGrid />
      <AddFab onClick={() => navigate('/offers/-1')} />
    </>
  );
}
