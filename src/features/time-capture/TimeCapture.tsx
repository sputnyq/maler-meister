import { Card, CardContent, CardHeader } from '@mui/material';

import { useState } from 'react';

import { TimeCaptureFlow } from './TimeCaptureFlow';
import { UserTimes } from './UserTimes';

export default function TimeCapture() {
  const [update, setUpdate] = useState(0);

  return (
    <Card>
      <CardHeader title="Meine Zeiten" />
      <CardContent>
        <UserTimes update={update} />
      </CardContent>
      <TimeCaptureFlow requestUpdate={() => setUpdate((u) => u + 1)} />
    </Card>
  );
}
