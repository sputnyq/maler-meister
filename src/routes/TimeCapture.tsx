import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect } from "react";
import TimeCaptureFlow from "../components/time-capture-flow/TimeCaptureFlow";
import UserTimes from "../components/user-times/UserTimes";
import { appRequest } from "../fetch/fetch-client";

export default function TimeCapture() {
  return (
    <Box>
      <Card>
        <CardHeader
          title={<Typography variant="h4">Meine Zeiten</Typography>}
        />
        <CardContent>
          <UserTimes />
        </CardContent>
      </Card>
      <TimeCaptureFlow />
    </Box>
  );
}
