import { offerById } from '../fetch/endpoints';
import { appRequest } from '../fetch/fetch-client';
import { genericConverter } from '../utilities';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, set } from 'lodash';

interface RootState {
  current: AppOffer | null;
  unsavedChanges: boolean;
}

const initialState: RootState = {
  current: null,
  unsavedChanges: false,
};

const createOffer = () => {
  const offer = {
    offerServices: new Array<BgbOfferService>(),
    text: '',
  } as AppOffer;
  return offer;
};

export const loadOffer = createAsyncThunk('Offers/load', async (id: string | number) => {
  const response = await appRequest('get')(offerById(id));

  return genericConverter<AppOffer>(response.data);
});

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    initOffer(state) {
      state.current = createOffer();
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
    builder.addCase(loadOffer.fulfilled, (state, action) => {
      state.current = action.payload;
      state.unsavedChanges = false;
    });
  },
});

const offerReducer = offerSlice.reducer;

export const { setOfferProp, initOffer } = offerSlice.actions;
export { offerReducer };
