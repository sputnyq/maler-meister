import { Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadConstructionById } from '../../fetch/api';

interface Props {
  constructionId: string | number;
}

export default function ConstructionView({ constructionId }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (constructionId !== null) {
      loadConstructionById(constructionId).then((construction) => {
        if (construction) {
          setName(construction.name);
        }
      });
    }
  }, [constructionId]);
  if (constructionId) {
    return <Typography>{`${constructionId} - ${name}`}</Typography>;
  }
  return <Typography>Unbekannt</Typography>;
}
