import { Box, Paper } from "@mui/material";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddButton } from "../components/AddButton";
import { AppDataGrid } from "../components/aa-shared/app-data-grid/AppDataGrid";
import { useLoadJobs } from "../hooks/useLoadJobs";
import { AppDispatch, AppState } from "../store";
import { createJob, updateJob } from "../store/jobsReducer";

export default function Jobs() {
  useLoadJobs();

  const dispatch = useDispatch<AppDispatch>();

  const appJobs =
    useSelector<AppState, AppJob[] | undefined>((s) => s.jobs.jobs) || [];

  const handleCreateRequest = useCallback(() => {
    dispatch(createJob());
  }, [dispatch]);

  const handleUpdateRequest = useCallback(
    (next: AppJob) => {
      dispatch(updateJob(next));
    },
    [dispatch]
  );

  return (
    <>
      <Paper>
        <AppDataGrid
          onUpdate={handleUpdateRequest}
          disablePagination
          data={appJobs}
          columns={[
            {
              field: "id",
              headerName: "ID",
            },
            {
              field: "name",
              headerName: "Name",
              editable: true,
              flex: 1,
            },
          ]}
        />
      </Paper>
      <Box marginY={2}>
        <AddButton onAdd={handleCreateRequest} />
      </Box>
    </>
  );
}
