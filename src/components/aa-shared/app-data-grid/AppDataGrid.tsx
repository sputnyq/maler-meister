import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Backdrop, Box, CircularProgress, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridFeatureMode,
  GridPaginationModel,
  GridRowClassNameParams,
} from '@mui/x-data-grid';

import { useMemo } from 'react';

import { prepareCols } from './appDataGridUtils';

interface Props {
  data: any[];
  columns: GridColDef[];
  paginationModel?: GridPaginationModel;
  paginationMode?: GridFeatureMode;
  disablePagination?: boolean;
  allowDeletion?: true;
  loading?: boolean;
  setPaginationModel?: (model: GridPaginationModel) => void;
  onUpdate?: (next: any) => void;
  onDelete?: (id: string) => void;
  getRowClassName?: (params: GridRowClassNameParams) => string;
}

export function AppDataGrid({
  paginationModel,
  columns,
  data,
  paginationMode = 'server',
  disablePagination,
  allowDeletion,
  loading,
  onDelete,
  setPaginationModel,
  onUpdate,
  getRowClassName,
}: Props) {
  const gridColumns = useMemo(() => {
    if (allowDeletion) {
      const deleteCol: GridColDef = {
        field: '__delete',
        headerName: 'Löschen',
        align: 'left',
        renderCell({ row }) {
          return (
            <IconButton
              color="error"
              onClick={() => {
                if (window.confirm('Möchtest du es wirklich löschen?')) {
                  onDelete?.(row.id);
                }
              }}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          );
        },
      };
      return prepareCols([deleteCol, ...columns]);
    }

    return prepareCols(columns);
  }, [columns, allowDeletion, onDelete]);

  return (
    <Paper elevation={0}>
      <Box
        position={'relative'}
        sx={{
          '& .MuiDataGrid-footerContainer': {
            display: `${disablePagination ? 'none' : 'block'}`,
            borderTop: 'none',
          },
          '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel, & .MuiTablePagination-selectLabel + .MuiInputBase-root':
            {
              display: 'none !important',
            },
          '& .MuiDataGrid-root': {
            border: 'none',
          },
        }}
      >
        <Backdrop
          open={loading || false}
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            position: 'absolute',
          }}
        >
          <CircularProgress color="primary" />
        </Backdrop>

        <StyledDataGrid
          rowHeight={45}
          localeText={{
            noResultsOverlayLabel: 'Keine Ergebnisse',
          }}
          getRowClassName={getRowClassName}
          disableRowSelectionOnClick
          autoHeight
          columns={gridColumns}
          rows={data}
          rowCount={10000}
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 100]}
          onCellEditStop={
            ((params, event) => {
              //@ts-ignore
              const value = event?.target?.value;

              const next = { ...params.row };
              next[params.field] = value;
              onUpdate?.(next);
            }) as GridEventListener<'cellEditStop'>
          }
        />
      </Box>
    </Paper>
  );
}

const StyledDataGrid = styled(DataGrid)(() => ({
  '& .bold': {
    fontWeight: 'bold',
  },
}));