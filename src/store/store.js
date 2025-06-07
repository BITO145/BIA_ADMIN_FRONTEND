// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/authSlice";
import subAdminReducer from "../slices/subadmin/subadminSlice";
import chapterReducer from "../slices/chapter/chapterSlice";
import eventsReducer from "../slices/event/eventSlice";
import opportunityReducer from "../slices/opportunity/oppSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    subAdmins: subAdminReducer,
    chapters: chapterReducer,
    events: eventsReducer,
    opportunity: opportunityReducer,
  },
});

export default store;
