import { constructionReducer } from './constructionReducer';
import { invoiceReducer } from './invoiceReducer';
import { jobsReducer } from './jobsReducer';
import { loginReducer } from './loginReducer';
import { offerReducer } from './offerReducer';
import { printSettingsReducer } from './printSettingsReducer';
import { servicesReducer } from './servicesReducer';
import { usersReducer } from './usersReducer';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducer = combineReducers({
  offer: offerReducer,
  invoice: invoiceReducer,
  login: loginReducer,
  construction: constructionReducer,
  jobs: jobsReducer,
  services: servicesReducer,
  prinSettings: printSettingsReducer,
  users: usersReducer,
});

export const store = configureStore({
  reducer: reducer,
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
