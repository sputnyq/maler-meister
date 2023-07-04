import { Card, CardContent, CardHeader } from '@mui/material';

import TimeCaptureFlow from './TimeCaptureFlow';
import UserTimes from './UserTimes';

export default function TimeCapture() {
  return (
    <>
      <Card>
        <CardHeader title="Meine Zeiten" />
        <CardContent>
          <UserTimes />
        </CardContent>
      </Card>
      <TimeCaptureFlow />
    </>
  );
}
