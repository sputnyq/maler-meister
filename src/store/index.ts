import { configureStore } from "@reduxjs/toolkit";
import { offerReducer } from "./offerReducer";

export const store = configureStore({
  reducer: {
    offer: offerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
