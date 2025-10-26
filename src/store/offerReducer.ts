import { AppState } from '.';
import { offerById } from '../fetch/endpoints';
import { appRequest } from '../fetch/fetch-client';
import { genericConverter } from '../utilities';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { formatISO } from 'date-fns';
import { cloneDeep, set } from 'lodash';

interface RootState {
  current: Maybe<AppOffer>;
  unsavedChanges: boolean;
}

const initialState: RootState = {
  current: null,
  unsavedChanges: false,
};

const initializeOffer = () => {
  const offer = {
    offerServices: [{} as OfferService],
    date: formatISO(new Date(), { representation: 'date' }),
    text: '',
  } as AppOffer;
  return offer;
};

export const loadOffer = createAsyncThunk('offers/load', async (id: string | number) => {
  const response = await appRequest('get')(offerById(id));

  return genericConverter<AppOffer>(response.data);
});

export const updateOffer = createAsyncThunk<AppOffer, void, { state: AppState }>(
  'offers/update',
  async (_, thunkApi) => {
    const offer = thunkApi.getState().offer.current!;

    const response = await appRequest('put')(offerById(offer.id), {
      data: {
        ...offer,
        constructionId: String(offer.constructionId) === '' ? undefined : offer.constructionId,
      },
    });

    return genericConverter<AppOffer>(response.data);
  },
);

export const createOffer = createAsyncThunk<
  AppOffer,
  { cb: (id: string | number) => void },
  { state: AppState }
>('offers/create', async (payload, thunkApi) => {
  const offer = thunkApi.getState().offer.current!; // never happens
  const tenant = thunkApi.getState().login.user?.tenant;

  const response = await appRequest('post')(offerById(''), {
    data: {
      ...offer,
      tenant,
      constructionId: String(offer.constructionId) === '' ? undefined : offer.constructionId,
    },
  });
  const converted = genericConverter<AppOffer>(response.data);
  payload.cb(converted.id);
  return converted;
});

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    initOffer(state) {
      state.current = initializeOffer();
    },
    setOfferProp(state, action: PayloadAction<{ path: string[]; value: any }>) {
      const { path, value } = action.payload;
      if (state.current !== null) {
        const next = cloneDeep(state.current);
        set(next, path, value);
        state.current = next;
        state.unsavedChanges = true;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadOffer.fulfilled, (state, action) => {
        state.current = action.payload;
        state.unsavedChanges = false;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.current = action.payload;
        state.unsavedChanges = false;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.current = action.payload;
        state.unsavedChanges = false;
      });
  },
});

const offerReducer = offerSlice.reducer;

export const { setOfferProp, initOffer } = offerSlice.actions;
export { offerReducer };
