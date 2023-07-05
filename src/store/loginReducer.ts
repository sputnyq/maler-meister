import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface RootState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: RootState = {
  user: null,
  isLoggedIn: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

const loginReducer = loginSlice.reducer;

export const { login, logout } = loginSlice.actions;

export { loginReducer };
