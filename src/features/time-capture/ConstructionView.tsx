import { Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { appRequest } from '../../fetch/fetch-client';
import { genericConverter } from '../../utils';

interface Props {
  constructionId: string | number;
}

export default function ConstructionView({ constructionId }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    appRequest('get')(`constructions/${constructionId}`).then((res) => {
      const resolved = genericConverter<Construction>(res.data);
      setName(resolved.name);
    });
  }, [constructionId]);
  return <Typography variant="h6">{`${constructionId} | ${name}`}</Typography>;
}
