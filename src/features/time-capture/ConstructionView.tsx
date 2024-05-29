import { Box, Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadConstructions } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface Props {
  constructionId: string | number | undefined;
}

export default function ConstructionView({ constructionId }: Readonly<Props>) {
  const user = useCurrentUser();

  const [name, setName] = useState<Maybe<string>>(null);

  useEffect(() => {
    if (constructionId && user?.tenant) {
      loadConstructions({ filters: { id: constructionId, tenant: user?.tenant } }).then((res) => {
        if (res?.constructions.length === 1) {
          setName(res.constructions[0].name);
        }
      });
    }
  }, [constructionId, user]);

  if (!constructionId) {
    return null;
  }

  return (
    <Box display="flex" gap={1} alignItems="center" sx={{ height: '100%' }}>
      <Typography variant="body2" color={name ? 'info' : 'error'}>{`${String(
        constructionId,
      ).padStart(4, '0')} | ${name ? name : 'unbekannt'}`}</Typography>
    </Box>
  );
}
