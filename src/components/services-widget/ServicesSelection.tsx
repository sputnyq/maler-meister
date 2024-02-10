import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Card, CardContent, Checkbox, Typography, useTheme } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';

import { useSelector } from 'react-redux';

import { AppState } from '../../store';
import { AppDialog } from '../AppDialog';

interface Props {
  open: boolean;
  onClose(): void;
  offerServices: OfferService[];
  onCheck(id: number, checked: boolean): void;
}

export function ServicesSelection(props: Props) {
  const { onClose, open, offerServices, onCheck } = props;

  const jobs = useSelector<AppState, AppJob[] | undefined>((s) => s.jobs.jobs);

  return (
    <AppDialog open={open} onClose={onClose} title="Leistungen auswählen">
      <Card elevation={0}>
        <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
          <TreeView defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
            {jobs?.map((job) => (
              <JobRender onCheck={onCheck} offerServices={offerServices} job={job} key={job.id} />
            ))}
          </TreeView>
        </CardContent>
      </Card>
    </AppDialog>
  );
}

interface JobRenderProps {
  job: AppJob;
  offerServices: OfferService[];
  onCheck(id: number, checked: boolean): void;
}

function JobRender({ job, offerServices, onCheck }: JobRenderProps) {
  const services = useSelector<AppState, BgbService[] | undefined>((s) => s.services.bgbServices);

  const theme = useTheme();
  const filtered = services?.filter((s) => s.jobId === job.id) || [];
  if (filtered.length < 1) {
    return null;
  }

  const included = (id: number) => offerServices.findIndex((os) => os.id === id) > -1;

  const handleChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    onCheck(id, event.target.checked);
  };

  return (
    <TreeItem nodeId={`job-${job.id}`} label={job.name}>
      {filtered.map((serv) => (
        <TreeItem
          key={serv.id}
          nodeId={String(serv.id)}
          label={
            <Box
              borderBottom={`1px solid ${theme.palette.grey[200]}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1">{serv.name}</Typography>
              <Checkbox checked={included(serv.id)} onChange={(ev) => handleChange(serv.id, ev)} />
            </Box>
          }
        />
      ))}
    </TreeItem>
  );
}
