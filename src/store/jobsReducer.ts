import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appRequest } from "../fetch/fetch-client";
import { genericConverter } from "../utils";

interface RootState {
  jobs?: AppJob[];
}

const initialState: RootState = {};

const BASE = "jobs";

export const loadAllJobs = createAsyncThunk("jobs/load-all", () => {
  return appRequest("get")(BASE).then((res: any) => {
    const converted = (res.data as any[]).map((e) =>
      genericConverter<AppJob>(e)
    );
    return converted;
  });
});

export const createJob = createAsyncThunk("jobs/create", () => {
  return appRequest("post")(BASE, { data: { name: "NEU" } }).then(
    (res: any) => {
      return genericConverter<AppJob>(res.data);
    }
  );
});

export const updateJob = createAsyncThunk("jobs/update", (next: AppJob) => {
  return appRequest("put")(`${BASE}/${next.id}`, { ...next }).then(
    (res: any) => {
      return genericConverter<AppJob>(res.data);
    }
  );
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadAllJobs.fulfilled, (state, action) => {
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
