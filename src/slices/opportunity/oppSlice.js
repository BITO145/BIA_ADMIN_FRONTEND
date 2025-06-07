// src/slices/opp/oppSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  opportunities: [],
  loading: false,
  error: null,
};

const oppSlice = createSlice({
  name: "opportunity",
  initialState,
  reducers: {
    setOppLoading(state, action) {
      state.loading = action.payload;
    },
    setOppError(state, action) {
      state.error = action.payload;
    },
    addOpportunity(state, action) {
      state.opportunities.push(action.payload);
    },
    setOpportunities(state, action) {
      state.opportunities = action.payload;
    },
    removeOpportunity(state, action) {
      state.opportunities = state.opportunities.filter(
        (opp) => opp._id !== action.payload
      );
    },
    updateOpportunity(state, action) {
      const index = state.opportunities.findIndex(
        (opp) => opp._id === action.payload._id
      );
      if (index !== -1) {
        state.opportunities[index] = action.payload;
      }
    },
  },
});

export const {
  setOppLoading,
  setOppError,
  addOpportunity,
  setOpportunities,
  removeOpportunity,
  updateOpportunity,
} = oppSlice.actions;

// Selectors
export const selectOpportunities = (state) => state.opportunity.opportunities;
export const selectOppLoading = (state) => state.opportunity.loading;
export const selectOppError = (state) => state.opportunity.error;

export default oppSlice.reducer;
