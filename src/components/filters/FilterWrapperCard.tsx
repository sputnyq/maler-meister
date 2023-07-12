import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';

import React from 'react';

import AppGrid from '../AppGrid';
import { AppGridField } from '../AppGridField';

interface Props {
  onSearch(): void;
  onReset(): void;
}

export function FilterWrapperCard({ onReset, onSearch, children }: React.PropsWithChildren<Props>) {
  return (
    <Card>
      <CardContent>
        <AppGrid>
          {children}
          <AppGridField>
            <Box display={'flex'} gap={2}>
              <Button startIcon={<SearchOutlinedIcon />} variant="contained" disableElevation onClick={onSearch}>
                Suchen
              </Button>

              <Tooltip title="Alle Filter zurücksetzen">
                <IconButton onClick={onReset}>
                  <RestartAltOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </AppGridField>
        </AppGrid>
      </CardContent>
    </Card>
  );
}
