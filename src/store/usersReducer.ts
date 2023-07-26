import { AppState } from '.';
import { users } from '../fetch/endpoints';
import { appRequest } from '../fetch/fetch-client';
import { buildQuery } from '../utilities';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface RootState {
  all: User[];
}

const initialState: RootState = {
  all: [],
};

export const loadUsers = createAsyncThunk<User[], void, { state: AppState }>('users/load-all', async (_, thunkApi) => {
  const tenant = thunkApi.getState().login.user?.tenant;
  const query = buildQuery({
    filters: {
      tenant,
    },
    sort: { '0': 'lastName:asc' },
  });
  const response = await appRequest('get')(users(query));
  return response as User[];
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.all = action.payload;
    });
  },
});

const r = usersSlice.reducer;

export { r as usersReducer };
