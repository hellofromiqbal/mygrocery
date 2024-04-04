import { createSlice } from '@reduxjs/toolkit'

const currTags = createSlice({
  name: 'currTags',
  initialState: {
    info: undefined
  },
  reducers: {
    addCurrTags: (state, action) => {
      state.info = action.payload;
    }
  }
});

export const {
  addCurrTags,
} = currTags.actions;
export const selectCurrTags = (state) => state.currTags.info;
export default currTags.reducer;