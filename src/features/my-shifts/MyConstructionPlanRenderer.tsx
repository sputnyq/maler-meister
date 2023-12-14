import { Stack, Typography } from '@mui/material';

import { useWorkers } from '../../hooks/useWorkers';
import { getFullWorkerName } from '../../utilities';

interface Props {
  constructionPlan: ConstructionPlan;
}

export function MyConstructionPlanRenderer({ constructionPlan }: Readonly<Props>) {
  const workers = useWorkers();

  const { name, usernames } = constructionPlan;

  return (
    <>
      <Typography>{name}</Typography>
      <Stack gap={1} direction="row">
        {usernames.map((username) => (
          <Typography>{getFullWorkerName(username, workers)}</Typography>
        ))}
      </Stack>
    </>
  );
}
