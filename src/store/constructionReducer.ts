import { AppState } from '.';
import { loadConstructions } from '../fetch/api';
import { appRequest } from '../fetch/fetch-client';
import { genericConverter } from '../utilities';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RootState {
  activeConstructions?: Construction[];
}

const initialState: RootState = {};

const BASE = 'constructions';

export const loadActiveConstructions = createAsyncThunk<Construction[], void, { state: AppState }>(
  'constructions/load-active',
  async (_, thunkApi) => {
    const appState = thunkApi.getState();
    const queryObj = {
      filters: {
        tenant: appState.login.user?.tenant,
        active: true,
      },
      sort: { '0': 'name:asc' },
    };
    return loadConstructions(queryObj).then((res) => res.constructions);
  },
);

export const updateConstruction = createAsyncThunk<Construction, Construction, { state: AppState }>(
  'constructions/update',
  async (construction) => {
    return appRequest('put')(`${BASE}/${construction.id}`, { data: construction }).then((res: any) => {
      return genericConverter<Construction>(res.data);
    });
  },
);

const constructionSlice = createSlice({
  name: 'construction',
  initialState,
  reducers: {
    addActiveConstruction(state, action: PayloadAction<Construction>) {
      if (!state.activeConstructions) {
        state.activeConstructions = new Array<Construction>();
      }
      state.activeConstructions.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadActiveConstructions.fulfilled, (state, action) => {
        state.activeConstructions = action.payload;
      })
      .addCase(updateConstruction.fulfilled, (state, action) => {
        const index = state.activeConstructions?.findIndex((ac) => ac.id === action.payload.id);
        if (index) {
          state.activeConstructions?.splice(index, 1, action.payload);
        }
      });
  },
});

const constructionReducer = constructionSlice.reducer;

export const { addActiveConstruction } = constructionSlice.actions;

export { constructionReducer };
