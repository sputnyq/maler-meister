import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import React from 'react';

export default function OfferAccounting() {
  return (
    <Card>
      <CardContent>
        <Box display={'flex'} flexDirection="column" gap={2}>
          <Box>
            <Button disableElevation variant="contained">
              Neue Rechnung erstellen
            </Button>
          </Box>
          <Typography variant="h6">Rechnungen zum Angebot</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
