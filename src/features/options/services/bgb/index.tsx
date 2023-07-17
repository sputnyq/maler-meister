import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import { AppState } from '../../../../store';
import { BgbServicesByJobGroup } from './BgbServicesByJobGroup';
import { CreateBgbService } from './CreateBgbService';

export default function BgbServices() {
  const jobs = useSelector<AppState, AppJob[]>((s) => s.jobs.jobs || []);

  console.log(jobs);

  return (
    <>
      <Box>
        {jobs.map(({ name, id }) => (
          <Accordion key={name}>
            <AccordionSummary aria-controls={`${name}-content`} id={`${name}-header`} expandIcon={<ExpandMoreIcon />}>
              <Typography>{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BgbServicesByJobGroup jobId={id} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <CreateBgbService />
    </>
  );
}
