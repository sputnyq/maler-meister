import { AppState } from '.';
import { printSettingById, printSettings } from '../fetch/endpoints';
import { appRequest } from '../fetch/fetch-client';
import { buildQuery, genericConverter } from '../utilities';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RootState {
  all?: PrintSettingsRoot[];
}

const initialState: RootState = {};

export const loadPrintSettings = createAsyncThunk<PrintSettingsRoot[], void, { state: AppState }>(
  'print-settings/load-all',
  async (_, thunkApi) => {
    const appState = thunkApi.getState();

    const queryObj = {
      filters: {
        tenant: appState.login.user?.tenant,
      },
      sort: { '0': 'name:asc' },
    };

    const response = await appRequest('get')(printSettings(buildQuery(queryObj)));
    return (response.data as any[]).map((e) => genericConverter<PrintSettingsRoot>(e));
  },
);

export const createPrintSettings = createAsyncThunk<PrintSettingsRoot, string, { state: AppState }>(
  'print-settings/create',
  async (payload, thunkApi) => {
    const state = thunkApi.getState();
    return appRequest('post')(printSettingById(''), { data: { name: payload, tenant: state.login.user?.tenant } }).then(
      (res: any) => {
        return genericConverter<PrintSettingsRoot>(res.data);
      },
    );
  },
);

export const updatePrintSettings = createAsyncThunk('print-settings/update', (next: PrintSettingsRoot) => {
  return appRequest('put')(printSettingById(next.id), { data: { ...next } }).then((res: any) => {
    return genericConverter<PrintSettingsRoot>(res.data);
  });
});

export const deletePrintSettings = createAsyncThunk('print-settings/delete', async (id: number) => {
  await appRequest('delete')(printSettingById(id));
  return id;
});

const slice = createSlice({
  name: 'print-settings',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadPrintSettings.fulfilled, (state, action) => {
        state.all = action.payload;
      })
      .addCase(createPrintSettings.fulfilled, (state, action) => {
        if (!state.all) {
          state.all = [];
        }
        state.all.push(action.payload);
      })
      .addCase(updatePrintSettings.fulfilled, (state, action) => {
        const index = state.all?.findIndex((ps) => ps.id === action.payload.id);
        if (typeof index !== 'undefined' && index > -1) {
          state.all?.splice(index, 1, action.payload);
        }
      })
      .addCase(deletePrintSettings.fulfilled, (state, action) => {
        state.all = state.all?.filter((ps) => ps.id !== action.payload);
      });
  },
});

const r = slice.reducer;
export { r as printSettingsReducer };
