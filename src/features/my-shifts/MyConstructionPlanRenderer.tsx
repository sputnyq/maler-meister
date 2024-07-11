import { Box, Typography } from '@mui/material';

import { useWorkers } from '../../hooks/useWorkers';
import { getFullWorkerName } from '../../utilities';

interface Props {
  constructionPlan: ConstructionPlan;
}

export function MyConstructionPlanRenderer({ constructionPlan }: Readonly<Props>) {
  const workers = useWorkers();

  const { name, usernames } = constructionPlan;

  return (
    <Box>
      <Typography>{name}</Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {usernames.map((username) => (
          <Typography key={username} variant="caption">
            {getFullWorkerName(username, workers)}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
