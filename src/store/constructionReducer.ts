import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appRequest } from "../fetch/fetch-client";
import { genericConverter } from "../utils";

interface RootState {
  activeConstructions?: Construction[];
}

const initialState: RootState = {};

const BASE = "constructions";

export const loadActiveConstructions = createAsyncThunk(
  "constructions/load-active",
  () => {
    return appRequest("get")(`${BASE}?filters[active][$eq]=true`).then(
      (data: any) => {
        const converted = (data.data as any[]).map((e) =>
          genericConverter<Construction>(e)
        );
        return converted;
      }
    );
  }
);

const constructionSlice = createSlice({
  name: "construction",
  initialState,
  reducers: {
    addActiveConstruction(state, action: PayloadAction<Construction>) {
      if (!state.activeConstructions) {
        state.activeConstructions = new Array<Construction>();
      }
      state.activeConstructions.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(loadActiveConstructions.fulfilled, (state, action) => {
      state.activeConstructions = action.payload;
    });
  },
});

const constructionReducer = constructionSlice.reducer;

export const { addActiveConstruction } = constructionSlice.actions;

export { constructionReducer };
