// src/slices/subAdmin/subAdminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const subAdminSlice = createSlice({
  name: "subAdmins",
  initialState,
  reducers: {
    setSubAdmins: (state, action) => {
      state.data = action.payload;
    },
    addSubAdmin: (state, action) => {
      state.data.push(action.payload);
    },
    removeSubAdmin: (state, action) => {
      state.data = state.data.filter((admin) => admin.id !== action.payload);
    },
    setSubAdminLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubAdminError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSubAdmins,
  addSubAdmin,
  removeSubAdmin,
  setSubAdminLoading,
  setSubAdminError,
} = subAdminSlice.actions;

export default subAdminSlice.reducer;

// Selector
export const selectSubAdmins = (state) => state.subAdmins.data;
export const selectSubAdminsLoading = (state) => state.subAdmins.loading;
export const selectSubAdminsError = (state) => state.subAdmins.error;
