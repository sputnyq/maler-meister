import { AppState } from '.';
import { invoiceById } from '../fetch/endpoints';
import { appRequest } from '../fetch/fetch-client';
import { genericConverter } from '../utilities';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, set } from 'lodash';

interface RootState {
  current: AppInvoice | null;
  unsavedChanges: boolean;
}

const initialState: RootState = {
  current: null,
  unsavedChanges: false,
};

const initializeInvoice = () => {
  const offer = {
    offerServices: [{} as OfferService],

    text: '',
  } as AppInvoice;
  return offer;
};

export const loadInvoice = createAsyncThunk('invoices/load', async (id: string | number) => {
  const response = await appRequest('get')(invoiceById(id));

  return genericConverter<AppInvoice>(response.data);
});

export const updateInvoice = createAsyncThunk<AppInvoice, void, { state: AppState }>(
  'offers/update',
  async (_, thunkApi) => {
    const invoice = thunkApi.getState().invoice.current!;

    const response = await appRequest('put')(invoiceById(invoice.id), {
      data: {
        ...invoice,
        constructionId: String(invoice.constructionId) === '' ? undefined : invoice.constructionId,
      },
    });

    return genericConverter<AppInvoice>(response.data);
  },
);

export const createInvoice = createAsyncThunk<AppInvoice, { cb: (id: string | number) => void }, { state: AppState }>(
  'offers/create',
  async (payload, thunkApi) => {
    const invoice = thunkApi.getState().invoice.current!; // never happens
    const tenant = thunkApi.getState().login.user?.tenant;

    const response = await appRequest('post')(invoiceById(''), {
      data: {
        ...invoice,
        tenant,
        constructionId: String(invoice.constructionId) === '' ? undefined : invoice.constructionId,
      },
    });
    const converted = genericConverter<AppInvoice>(response.data);
    payload.cb(converted.id);
    return converted;
  },
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    initInvoice(state) {
      state.current = initializeInvoice();
    },
    setInvoiceProp(state, action: PayloadAction<{ path: string[]; value: any }>) {
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
      .addCase(loadInvoice.fulfilled, (state, action) => {
        state.current = action.payload;
        state.unsavedChanges = false;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.current = action.payload;
        state.unsavedChanges = false;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.current = action.payload;
        state.unsavedChanges = false;
      });
  },
});

const invoiceReducer = invoiceSlice.reducer;

export const { setInvoiceProp, initInvoice } = invoiceSlice.actions;
export { invoiceReducer };
