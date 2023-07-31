import { Box, Paper } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

import { useMemo } from 'react';

import { prepareCols } from './appDataGridUtils';

export function AppDataGrid(props: DataGridProps) {
  const { columns } = props;

  const gridColumns = useMemo(() => {
    return prepareCols(columns);
  }, [columns]);

  return (
    <Paper elevation={0}>
      <Box
        position={'relative'}
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
        }}
      >
        <DataGrid
          slotProps={{
            pagination: {
              labelRowsPerPage: 'Seitengröße',
              labelDisplayedRows(paginationInfo) {
                return `${paginationInfo.from}-${paginationInfo.to} von ${paginationInfo.count}`;
              },
            },
          }}
          rowHeight={35}
          localeText={{
            noRowsLabel: 'Keine Ergebnisse',
          }}
          disableRowSelectionOnClick
          autoHeight
          paginationMode={'server'}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          {...props}
          columns={gridColumns}
        />
      </Box>
    </Paper>
  );
}
