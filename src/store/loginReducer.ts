import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface RootState {
  user: User | null;
  isLoggedIn: boolean;
  appLoaded: boolean;
}

const initialState: RootState = {
  user: null,
  isLoggedIn: false,
  appLoaded: false,
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
    setAppLoaded(state) {
      state.appLoaded = true;
    },
  },
});

const loginReducer = loginSlice.reducer;

export const { login, logout, setAppLoaded } = loginSlice.actions;

export { loginReducer };
