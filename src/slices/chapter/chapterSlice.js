import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const chapterSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {
    setChapters: (state, action) => {
      state.data = action.payload;
    },
    addChapter: (state, action) => {
      state.data.push(action.payload);
    },
    removeChapter: (state, action) => {
      state.data = state.data.filter(
        (chapter) => chapter.id !== action.payload
      );
    },
    setChapterLoading: (state, action) => {
      state.loading = action.payload;
    },
    setChapterError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChapters,
  addChapter,
  removeChapter,
  setChapterLoading,
  setChapterError,
} = chapterSlice.actions;
export default chapterSlice.reducer;

// Selector
export const selectChapters = (state) => state.chapters.data;
export const selectChaptersLoading = (state) => state.chapters.loading;
export const selectChaptersError = (state) => state.chapters.error;
