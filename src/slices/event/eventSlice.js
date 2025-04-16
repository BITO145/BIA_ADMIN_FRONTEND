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
      console.log("[EventsSlice] setEvents:", state.data);
    },
    addEvent: (state, action) => {
      state.data.push(action.payload);
      console.log("[EventsSlice] addEvent:", action.payload);
    },
    removeEvent: (state, action) => {
      state.data = state.data.filter((event) => event.id !== action.payload);
      console.log("[EventsSlice] removeEvent id:", action.payload);
    },
    setEventLoading: (state, action) => {
      state.loading = action.payload;
      console.log("[EventsSlice] setEventLoading:", state.loading);
    },
    setEventError: (state, action) => {
      state.error = action.payload;
      console.log("[EventsSlice] setEventError:", state.error);
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
