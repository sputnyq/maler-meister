import { Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadConstructionById } from '../../fetch/api';

interface Props {
  constructionId: string | number;
}

export default function ConstructionView({ constructionId }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    loadConstructionById(constructionId).then((construction) => {
      if (construction) {
        setName(construction.name);
      }
    });
  }, [constructionId]);

  return <Typography>{`${constructionId} - ${name}`}</Typography>;
}
