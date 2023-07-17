import { Box, Card, CardContent } from '@mui/material';

import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '../../store';
import CreateJob from './CreateJob';
import JobEdit from './JobEdit';

export default function Jobs() {
  const appJobs = useSelector<AppState, AppJob[]>((s) => s.jobs.jobs || []);

  return (
    <>
      <Card>
        <CardContent>
          <Box display={'flex'} flexDirection="column" gap={2}>
            {appJobs.map((job) => (
              <JobEdit job={job} key={job.id} />
            ))}
          </Box>
        </CardContent>
      </Card>
      <CreateJob />
    </>
  );
}
