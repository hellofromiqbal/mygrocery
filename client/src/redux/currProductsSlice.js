import { createSlice } from '@reduxjs/toolkit'

const currProducts = createSlice({
  name: 'currProducts',
  initialState: {
    info: undefined
  },
  reducers: {
    addCurrProducts: (state, action) => {
      state.info = action.payload;
    },
    addNewProduct: (state, action) => {
      state.info.push(action.payload);
    },
    editProduct: (state, action) => {
      state.info = state.info.map((product) => {
        if(product._id === action.payload._id) {
          return action.payload;
        } else {
          return product;
        }
      });
    },
    deleteProduct: (state, action) => {
      state.info = state.info.filter((product) => product._id !== action.payload);
    }
  }
});

export const {
  addCurrProducts,
  addNewProduct,
  editProduct,
  deleteProduct
} = currProducts.actions;
export const selectCurrProducts = (state) => state.currProducts.info;
export default currProducts.reducer;