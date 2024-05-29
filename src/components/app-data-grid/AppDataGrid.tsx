import { Box, Paper, styled } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

import { useMemo } from 'react';

import { prepareCols } from './appDataGridUtils';

export function AppDataGrid(props: Readonly<DataGridProps>) {
  const { columns } = props;

  const gridColumns = useMemo(() => {
    return prepareCols([...columns]);
  }, [columns]);

  return (
    <Paper elevation={0}>
      <Box
        position={'relative'}
        // sx={{
        //   '& .MuiDataGrid-root': {
        //     border: 'none',
        //   },
        // }}
      >
        <StyledDataGrid
          slotProps={{
            pagination: {
              labelRowsPerPage: 'Seitengröße',
              labelDisplayedRows(paginationInfo) {
                return `${paginationInfo.from}-${paginationInfo.to} von ${paginationInfo.count}`;
              },
            },
          }}
          rowHeight={40}
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

const StyledDataGrid = styled(DataGrid)(({ theme }) => {
  return {
    '.MuiDataGrid-container--top [role=row]': {
      background: theme.palette.background.paper,
    },
  };
});
