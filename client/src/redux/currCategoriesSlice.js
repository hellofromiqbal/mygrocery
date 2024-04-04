import { createSlice } from '@reduxjs/toolkit'

const currCategories = createSlice({
  name: 'currCategories',
  initialState: {
    info: undefined
  },
  reducers: {
    addCurrCategories: (state, action) => {
      state.info = action.payload;
    }
  }
});

export const {
  addCurrCategories,
} = currCategories.actions;
export const selectCurrCategories = (state) => state.currCategories.info;
export default currCategories.reducer;