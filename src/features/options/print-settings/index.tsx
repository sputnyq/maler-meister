import { Box, Tab, Tabs } from '@mui/material';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import { TabPanel } from '../../../components/TabPanel';
import { AppState } from '../../../store';
import { CreatePrintSetting } from './CreatePrintSetting';
import { PrintSettingsEdit } from './PrintSettingsEdit';

export default function PrintSettings() {
  const [value, setValue] = useState(0);
  const printSettings = useSelector<AppState, PrintSettingsRoot[]>((s) => s.prinSettings.all || []);

  return (
    <>
      <Box>
        <Tabs
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          {printSettings.map((ps, index) => {
            return <Tab label={ps.name} key={index}></Tab>;
          })}
        </Tabs>
        <Box mt={1}>
          {printSettings.map((ps, index) => {
            return (
              <TabPanel index={index} value={value}>
                <PrintSettingsEdit ps={ps} />
              </TabPanel>
            );
          })}
        </Box>
      </Box>
      <CreatePrintSetting />
    </>
  );
}
