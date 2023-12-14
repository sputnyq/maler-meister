import { Box, Chip, Typography } from '@mui/material';

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
      <Typography color={'secondary'}>{name}</Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {usernames.map((username) => (
          <Chip color="info" size="small" label={getFullWorkerName(username, workers)} />
        ))}
      </Box>
    </Box>
  );
}
