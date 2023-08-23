import { Card, CardContent, CardHeader } from '@mui/material';

import { useState } from 'react';

import { MyTimes } from './MyTimes';
import { TimeCaptureFlow } from './TimeCaptureFlow';

export default function TimeCapture() {
  const [update, setUpdate] = useState(0);

  return (
    <Card>
      <CardHeader title="Meine Zeiten" />
      <CardContent>
        <MyTimes update={update} requestUpdate={() => setUpdate((u) => u + 1)} />
      </CardContent>
      <TimeCaptureFlow requestUpdate={() => setUpdate((u) => u + 1)} />
    </Card>
  );
}
