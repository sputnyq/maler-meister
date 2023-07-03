import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appRequest } from "../fetch/fetch-client";
import { genericConverter } from "../utils";

interface RootState {
  activeConstructions: Construction[];
}

const initialState: RootState = {
  activeConstructions: [],
};

const CONSTRUCTION_BASE = "constructions";

export const loadActiveConstructions = createAsyncThunk(
  "constructions/load-active",
  () => {
    return appRequest("get")(`${CONSTRUCTION_BASE}?active=true`).then(
      (data: any) => {
        const after = (data.data as any[]).map((e) =>
          genericConverter<Construction>(e)
        );
        return after;
      }
    );
  }
);

const constructionSlice = createSlice({
  name: "construction",
  initialState,
  reducers: {
    addActiveConstruction(state, action: PayloadAction<Construction>) {
      state.activeConstructions.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(loadActiveConstructions.fulfilled, (state, action) => {
      console.log(action.payload);
      state.activeConstructions.push(...action.payload);
    });
  },
});

const constructionReducer = constructionSlice.reducer;

export const { addActiveConstruction } = constructionSlice.actions;

export { constructionReducer };
