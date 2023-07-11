import { useParams } from 'react-router-dom';

import EditConstructionWidget from '../../components/EditConstructionWidget';

export default function EditConstructionRoute() {
  const params = useParams();
  const id = params.id;

  if (id) {
    return <EditConstructionWidget id={id} />;
  }
  return null;
}
