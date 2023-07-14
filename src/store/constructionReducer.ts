import { AppState } from '.';
import { loadConstructions } from '../fetch/api';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RootState {
  activeConstructions?: Construction[];
}

const initialState: RootState = {};

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
    builder.addCase(loadActiveConstructions.fulfilled, (state, action) => {
      state.activeConstructions = action.payload;
    });
  },
});

const constructionReducer = constructionSlice.reducer;

export const { addActiveConstruction } = constructionSlice.actions;

export { constructionReducer };
