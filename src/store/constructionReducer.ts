import { appRequest } from '../fetch/fetch-client';
import { genericConverter } from '../utils';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RootState {
  activeConstructions?: Construction[];
}

const initialState: RootState = {};

const BASE = 'constructions';

export const loadActiveConstructions = createAsyncThunk('constructions/load-active', () => {
  return appRequest('get')(`${BASE}?filters[active][$eq]=true`).then((res: any) => {
    return (res.data as any[]).map((e) => genericConverter<Construction>(e));
  });
});

export const updateConstruction = createAsyncThunk('constructions/update', (construction: Construction) => {
  return appRequest('put')(`${BASE}/${construction.id}`, { data: construction }).then((res: any) => {
    return genericConverter<Construction>(res.data);
  });
});

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

  extraReducers(builder) {
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
