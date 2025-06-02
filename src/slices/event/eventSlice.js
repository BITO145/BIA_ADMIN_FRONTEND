// src/slices/events/eventsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.data = action.payload;
    },
    addEvent: (state, action) => {
      state.data.push(action.payload);
    },
    removeEvent: (state, action) => {
      state.data = state.data.filter((event) => event.id !== action.payload);
    },
    setEventLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEventError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setEvents,
  addEvent,
  removeEvent,
  setEventLoading,
  setEventError,
} = eventsSlice.actions;

export default eventsSlice.reducer;

export const selectEvents = (state) => state.events.data;
export const selectEventsLoading = (state) => state.events.loading;
export const selectEventsError = (state) => state.events.error;
