import { Box, Paper } from '@mui/material';
import { GridEventListener } from '@mui/x-data-grid';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDataGrid } from '../components/aa-shared/app-data-grid/AppDataGrid';
import { AddButtonWidget } from '../components/widgets/AddButtonWidget';
import { loadJobs } from '../fetch/api';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { AppDispatch } from '../store';
import { createJob, updateJob } from '../store/jobsReducer';

export default function Jobs() {
  const user = useCurrentUser();

  const [update, setUpdate] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<AppJob[]>([]);

  const handleCreateRequest = useCallback(async () => {
    await dispatch(createJob());
    setUpdate((u) => u + 1);
  }, [dispatch]);

  const handleUpdateRequest = useCallback(
    async (next: AppJob) => {
      await dispatch(updateJob(next));
    },
    [dispatch],
  );

  const columns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID',
      },
      {
        field: 'name',
        headerName: 'Name',
        editable: true,
        flex: 1,
      },
    ];
  }, []);

  useEffect(() => {
    setLoading(true);

    const queryObj = {
      filters: {
        tenant: user?.tenant,
      },
      sort: { '0': 'createdAt:desc' },
      pagination: {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      },
    };

    loadJobs(queryObj)
      .then((res) => {
        setData(res.jobs);
        setRowCount(res.meta.pagination.total);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [update, paginationModel.page, paginationModel.pageSize, user?.tenant]);

  return (
    <>
      <Paper>
        <AppDataGrid
          onCellEditStop={
            ((params, event) => {
              //@ts-ignore
              const value = event?.target?.value;

              const next = { ...params.row };
              next[params.field] = value;
              handleUpdateRequest(next);
            }) as GridEventListener<'cellEditStop'>
          }
          rows={data}
          columns={columns}
          rowCount={rowCount}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          loading={loading}
        />
      </Paper>
      <Box marginY={2}>
        <AddButtonWidget onAdd={handleCreateRequest} />
      </Box>
    </>
  );
}
