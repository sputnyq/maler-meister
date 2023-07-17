import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';

import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '../../../store';
import { CreatePrintSetting } from './CreatePrintSetting';
import { PrintSettingsEdit } from './PrintSettingsEdit';

export default function PrintSettings() {
  const printSettings = useSelector<AppState, PrintSettingsRoot[]>((s) => s.prinSettings.all || []);

  return (
    <>
      <Box>
        {printSettings.map((ps) => {
          return (
            <Accordion>
              <AccordionSummary
                aria-controls={`${ps.name}-content`}
                id={`${ps.name}-header`}
                expandIcon={<ExpandMoreIcon />}
              >
                {ps.name}
              </AccordionSummary>
              <AccordionDetails>
                <PrintSettingsEdit ps={ps} />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
      <CreatePrintSetting />
    </>
  );
}
