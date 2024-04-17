import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadConstructions } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface Props {
  constructionId: string | number | undefined;
}

export default function ConstructionView({ constructionId }: Readonly<Props>) {
  const user = useCurrentUser();

  const [name, setName] = useState('');
  const [known, setKnown] = useState(false);

  useEffect(() => {
    if (constructionId && user?.tenant) {
      loadConstructions({ filters: { id: constructionId, tenant: user?.tenant } }).then((res) => {
        if (res?.constructions.length === 1) {
          setName(res.constructions[0].name);
          setKnown(true);
        }
      });
    } else {
      setKnown(false);
    }
  }, [constructionId, user]);

  if (!constructionId) {
    return null;
  }

  let content = null;

  if (constructionId && known) {
    content = (
      <Typography color="secondary" variant="body2">{`${constructionId}${name ? ' | '.concat(name) : ''}`}</Typography>
    );
  } else {
    content = (
      <>
        <ErrorOutlineOutlinedIcon color="error" />
        <Typography color="error" variant="body2">
          {`unbekannte Baustellen-ID: ${constructionId}`}
        </Typography>
      </>
    );
  }
  return (
    <Box display="flex" gap={1} alignItems="center" sx={{ height: '100%' }}>
      {content}
    </Box>
  );
}
