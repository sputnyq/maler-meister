import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "./loginReducer";
import { offerReducer } from "./offerReducer";

export const store = configureStore({
  reducer: {
    offer: offerReducer,
    login: loginReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
