import { Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadConstructions } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface Props {
  constructionId: string | number | undefined;
}

export default function ConstructionView({ constructionId }: Props) {
  const [name, setName] = useState('');
  const user = useCurrentUser();

  useEffect(() => {
    if (constructionId && user?.tenant) {
      loadConstructions({ filters: { id: constructionId, tenant: user?.tenant } }).then((res) => {
        if (res?.constructions.length === 1) {
          setName(res.constructions[0].name);
        }
      });
    }
  }, [constructionId, user]);

  if (constructionId) {
    return (
      <Typography p={1} color="secondary" variant="body2">{`${constructionId}${
        name ? ' | '.concat(name) : ''
      }`}</Typography>
    );
  }
  return null;
}
