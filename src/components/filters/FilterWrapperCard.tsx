import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';

import React from 'react';

import AppGrid from '../aa-shared/AppGrid';
import FilterGridItem from './FilterGridItem';

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
          <FilterGridItem>
            <Box display={'flex'} justifyContent="flex-end" gap={2}>
              <Tooltip title="Alle Filter zurücksetzen">
                <IconButton onClick={onReset}>
                  <RestartAltOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Button startIcon={<SearchOutlinedIcon />} variant="contained" disableElevation onClick={onSearch}>
                Suchen
              </Button>
            </Box>
          </FilterGridItem>
        </AppGrid>
      </CardContent>
    </Card>
  );
}
