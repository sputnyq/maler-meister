import { Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadConstructionById } from '../../fetch/api';

interface Props {
  constructionId: string | number | undefined;
}

export default function ConstructionView({ constructionId }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (constructionId) {
      loadConstructionById(constructionId).then((construction) => {
        if (construction) {
          setName(construction.name);
        }
      });
    }
  }, [constructionId]);
  if (constructionId) {
    return (
      <Typography p={1} color="secondary" variant="body2">{`${constructionId}${
        name ? ' | '.concat(name) : ''
      }`}</Typography>
    );
  }
  return null;
}
