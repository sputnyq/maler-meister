import { Card, CardContent, CardHeader } from '@mui/material';

import { useState } from 'react';

import { TimeCaptureFlow } from './TimeCaptureFlow';
import { WorkerTimes } from './WorkerTimes';

export default function TimeCapture() {
  const [update, setUpdate] = useState(0);

  return (
    <Card>
      <CardHeader title="Meine Zeiten" />
      <CardContent>
        <WorkerTimes />
        {/* <MyTimes update={update} requestUpdate={() => setUpdate((u) => u + 1)} /> */}
      </CardContent>
      <TimeCaptureFlow requestUpdate={() => setUpdate((u) => u + 1)} />
    </Card>
  );
}
