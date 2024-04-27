import { Card, CardContent } from '@mui/material';

import { useSelector } from 'react-redux';

import { ColFlexBox } from '../../../components/ColFlexBox';
import { AppState } from '../../../store';
import CreateJob from './CreateJob';
import JobEdit from './JobEdit';

export default function Jobs() {
  const appJobs = useSelector<AppState, AppJob[]>((s) => s.jobs.jobs || []);

  return (
    <>
      <Card elevation={0}>
        <CardContent>
          <ColFlexBox>
            {appJobs.map((job) => (
              <JobEdit job={job} key={job.id} />
            ))}
          </ColFlexBox>
        </CardContent>
      </Card>
      <CreateJob />
    </>
  );
}
