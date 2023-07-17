import { AppState } from '.';
import { appRequest } from '../fetch/fetch-client';
import { buildQuery, genericConverter } from '../utilities';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RootState {
  jobs?: AppJob[];
}

const initialState: RootState = {};

const BASE = 'jobs';

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
    const response = await appRequest('get')(`${BASE}?${query}`);

    return (response.data as any[]).map((e) => genericConverter<AppJob>(e));
  },
);

export const createJob = createAsyncThunk<AppJob, void, { state: AppState }>('jobs/create', async (_, thunkApi) => {
  const state = thunkApi.getState();
  return appRequest('post')(BASE, { data: { name: 'NEU', tenant: state.login.user?.tenant } }).then((res: any) => {
    return genericConverter<AppJob>(res.data);
  });
});

export const updateJob = createAsyncThunk('jobs/update', (next: AppJob) => {
  return appRequest('put')(`${BASE}/${next.id}`, { data: { ...next } }).then((res: any) => {
    return genericConverter<AppJob>(res.data);
  });
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
        if (index) {
          state.jobs?.splice(index, 1, action.payload);
        }
      });
  },
});

const r = jobsSlice.reducer;

export { r as jobsReducer };
