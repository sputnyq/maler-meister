import { Box, Tab, Tabs } from '@mui/material';

import { useState } from 'react';

import { TabPanel } from '../../components/aa-shared/TabPanel';
import DailyTimesView from './DailyTimesView';
import WorkEntriesTimesView from './WorkEntriesTimesView';

export default function Times() {
  const [value, setValue] = useState(0);
  return (
    <>
      <Tabs
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <Tab label="Tagessicht"></Tab>
        <Tab label="Arbeitssicht"></Tab>
      </Tabs>
      <Box mt={2}>
        <TabPanel index={0} value={value}>
          <DailyTimesView />
        </TabPanel>
        <TabPanel index={1} value={value}>
          <WorkEntriesTimesView />
        </TabPanel>
      </Box>
    </>
  );
}
