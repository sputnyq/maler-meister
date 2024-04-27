import { Box, Card, CircularProgress, Grid } from '@mui/material';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import AppGrid from '../../../components/AppGrid';
import { AppTextField } from '../../../components/AppTextField';
import { DeleteIconButton } from '../../../components/DeleteIconButton';
import { AppDispatch } from '../../../store';
import { deleteJob, updateJob } from '../../../store/jobsReducer';

interface Props {
  job: AppJob;
}
export default function JobEdit(props: Readonly<Props>) {
  const [job, setJob] = useState(props.job);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const onPropChange = (prop: keyof AppJob) => {
    return function (ev: React.ChangeEvent<HTMLInputElement>) {
      setJob((s) => ({ ...s, [prop]: ev.target.value }));
    };
  };

  const handleDelete = useCallback(() => {
    const text = 'Tätigkeit wirklich löschen?\nDas kann Auswirkungen auf andere App-Teile haben.';
    if (confirm(text)) {
      dispatch(deleteJob(job.id));
    }
  }, [job.id, dispatch]);

  const onBlur = async () => {
    setLoading(true);
    await dispatch(updateJob(job));
    setLoading(false);
  };

  return (
    <Card sx={{ py: 2 }} elevation={0}>
      <AppGrid>
        <Grid item xs={12} sm={8}>
          <AppTextField onBlur={onBlur} onChange={onPropChange('name')} label="Name" value={job.name} />
        </Grid>
        <Grid item xs={10} sm={2}>
          <AppTextField
            onBlur={onBlur}
            onChange={onPropChange('position')}
            label="Position"
            value={job.position}
            type="number"
          />
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" justifyContent="space-between" maxHeight={'40px'}>
            <Box>
              <DeleteIconButton onClick={handleDelete} />
            </Box>
            <Box>{loading && <CircularProgress sx={{ height: 30, width: 30 }} variant="indeterminate" />}</Box>
          </Box>
        </Grid>
      </AppGrid>
    </Card>
  );
}
