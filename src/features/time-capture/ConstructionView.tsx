import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadConstructions } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface Props {
  constructionId: string | number | undefined;
}

export default function ConstructionView({ constructionId }: Props) {
  const user = useCurrentUser();

  const [name, setName] = useState('');
  const [known, setKnown] = useState(false);

  useEffect(() => {
    if (constructionId && user?.tenant) {
      loadConstructions({ filters: { id: constructionId, tenant: user?.tenant } }).then((res) => {
        if (res?.constructions.length === 1) {
          setName(res.constructions[0].name);
          setKnown(true);
          return;
        }
      });
    }
    setKnown(false);
  }, [constructionId, user]);

  if (!constructionId) {
    return null;
  }

  if (constructionId && known) {
    return (
      <Typography color="secondary" variant="body2">{`${constructionId}${name ? ' | '.concat(name) : ''}`}</Typography>
    );
  } else {
    return (
      <Box display="flex" gap={1} alignItems="center">
        <ErrorOutlineOutlinedIcon color="error" />
        <Typography color="error" variant="body2">
          ungültige Baustellen-ID
        </Typography>
      </Box>
    );
  }
  return null;
}
