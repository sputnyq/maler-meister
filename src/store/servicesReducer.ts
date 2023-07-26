import { AppState } from '.';
import { fetchBgbServices } from '../fetch/api';
import { bgbServiceById } from '../fetch/endpoints';
import { appRequest } from '../fetch/fetch-client';
import { genericConverter } from '../utilities';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RootState {
  bgbServices?: BgbService[];
}

const initialState: RootState = {};

export const createUpdateBgbService = createAsyncThunk<BgbService, BgbService, { state: AppState }>(
  'services/create-update',
  async (payload, thunkApi) => {
    const tenant = thunkApi.getState().login.user?.tenant;

    const res = await appRequest(payload.id ? 'put' : 'post')(bgbServiceById(payload.id || ''), {
      data: { ...payload, tenant },
    });
    return genericConverter<BgbService>(res.data);
  },
);

export const deleteBgbService = createAsyncThunk('services/delete', async (id: number) => {
  await appRequest('delete')(bgbServiceById(id));
  return id;
});

export const loadServices = createAsyncThunk<BgbService[], void, { state: AppState }>(
  'services/load-bgb',
  async (_, thunkApi) => {
    const appState = thunkApi.getState();

    const queryObj = {
      filters: {
        tenant: appState.login.user?.tenant,
      },
      sort: { '0': 'name:asc' },
      pagination: {
        pageSize: 100,
      },
    };

    return fetchBgbServices(queryObj).then((res) => res.services);
  },
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadServices.fulfilled, (state, action) => {
        state.bgbServices = action.payload;
      })
      .addCase(createUpdateBgbService.fulfilled, (state, action) => {
        if (!state.bgbServices) {
          state.bgbServices = new Array<BgbService>();
        }
        const nextService = action.payload;
        const index = state.bgbServices.findIndex((s) => s.id === nextService.id);
        if (index !== -1) {
          state.bgbServices.splice(index, 1, nextService);
        } else {
          state.bgbServices.push(nextService);
        }
      })
      .addCase(deleteBgbService.fulfilled, (state, action) => {
        state.bgbServices = state.bgbServices?.filter((service) => service.id !== action.payload);
      });
  },
});

const servicesReducer = servicesSlice.reducer;

export { servicesReducer };
