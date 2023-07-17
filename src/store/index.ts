import { constructionReducer } from './constructionReducer';
import { jobsReducer } from './jobsReducer';
import { loginReducer } from './loginReducer';
import { offerReducer } from './offerReducer';
import { servicesReducer } from './servicesReducer';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducer = combineReducers({
  offer: offerReducer,
  login: loginReducer,
  construction: constructionReducer,
  jobs: jobsReducer,
  services: servicesReducer,
});

export const store = configureStore({
  reducer: reducer,
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
