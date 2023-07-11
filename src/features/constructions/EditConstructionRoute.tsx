import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { loadConstructionById } from '../../fetch/api';
import EditConstructionWidget from './EditConstructionWidget';

export default function EditConstructionRoute() {
  const [construction, setConstruction] = useState<Construction | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadConstructionById(id).then((res) => {
        if (res) {
          setConstruction(res);
        }
      });
    }
  }, [id]);

  if (construction) {
    return <EditConstructionWidget construction={construction} />;
  }
  return null;
}
