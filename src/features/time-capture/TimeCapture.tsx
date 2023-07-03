import { Card, CardContent, CardHeader } from '@mui/material';

import AppTypo from '../../components/aa-shared/AppTypo';
import TimeCaptureFlow from './TimeCaptureFlow';
import UserTimes from './UserTimes';

export default function TimeCapture() {
  return (
    <>
      <Card>
        <CardHeader title={<AppTypo>Meine Zeiten</AppTypo>} />
        <CardContent>
          <UserTimes />
        </CardContent>
      </Card>
      <TimeCaptureFlow />
    </>
  );
}
