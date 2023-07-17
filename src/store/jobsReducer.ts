import { AppState } from '.';
import { appJobById, appJobs } from '../fetch/endpoints';
import { appRequest } from '../fetch/fetch-client';
import { buildQuery, genericConverter } from '../utilities';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RootState {
  jobs?: AppJob[];
}

const initialState: RootState = {};

export const loadAllJobs = createAsyncThunk<AppJob[], void, { state: AppState }>(
  'jobs/load-all',
  async (_, thunkApi) => {
    const state = thunkApi.getState();
    const query = buildQuery({
      filters: {
        tenant: state.login.user?.tenant,
      },
      sort: { '0': 'name:asc' },
    });
    const response = await appRequest('get')(appJobs(query));

    return (response.data as any[]).map((e) => genericConverter<AppJob>(e));
  },
);

export const createJob = createAsyncThunk<AppJob, AppJob, { state: AppState }>(
  'jobs/create',
  async (payload, thunkApi) => {
    const state = thunkApi.getState();
    return appRequest('post')(appJobById(''), { data: { ...payload, tenant: state.login.user?.tenant } }).then(
      (res: any) => {
        return genericConverter<AppJob>(res.data);
      },
    );
  },
);

export const updateJob = createAsyncThunk('jobs/update', (next: AppJob) => {
  return appRequest('put')(appJobById(next.id), { data: { ...next } }).then((res: any) => {
    return genericConverter<AppJob>(res.data);
  });
});

export const deleteJob = createAsyncThunk('jobs/delete', async (id: number) => {
  await appRequest('delete')(appJobById(id));
  return id;
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadAllJobs.fulfilled, (state, action: PayloadAction<AppJob[]>) => {
        state.jobs = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        if (!state.jobs) {
          state.jobs = [];
        }
        state.jobs.push(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs?.findIndex((j) => j.id === action.payload.id);
        if (index && index > -1) {
          state.jobs?.splice(index, 1, action.payload);
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs?.filter((job) => job.id !== action.payload);
      });
  },
});

const r = jobsSlice.reducer;

export { r as jobsReducer };
