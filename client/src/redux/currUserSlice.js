import { createSlice } from '@reduxjs/toolkit'

const currUser = createSlice({
  name: 'currUser',
  initialState: {
    info: undefined
  },
  reducers: {
    addCurrUser: (state, action) => {
      state.info = action.payload;
    },
    removeCurrUser: (state, action) => {
      state.info = undefined;
    },
    addCartItemToCurrUser: (state, action) => {
      state.info.cart = action.payload;
    },
    removeCartItemFromCurrUser: (state, action) => {
      state.info.cart = state.info.cart.filter((item) => item.product._id !== action.payload)
    },
    incrementCartItemAmount: (state, action) => {
      state.info.cart = state.info.cart.map((item) => {
        if(item.product._id === action.payload) {
          item.amount += 1;
          return item;
        } else {
          return item;
        }
      });
    },
    decrementCartItemAmout: (state, action) => {
      state.info.cart = state.info.cart.map((item) => {
        if(item.product._id === action.payload) {
          item.amount -= 1;
          return item;
        } else {
          return item;
        }
      });
    },
    clearCart: (state, action) => {
      state.info.cart = [];
    },
    setInvoices: (state, action) => {
      state.info.invoices = action.payload;
    },
    addNewInvoice: (state, action) => {
      state.info.invoices.push(action.payload);
    },
    editInvoice: (state, action) => {
      state.info.invoices = state.info.invoices.map((invoice) => {
        if(invoice._id === action.payload.invoiceId) {
          invoice.paymentStatus = action.payload.paymentStatus;
          return invoice;
        } else {
          return invoice;
        }
      });
    },
    setAddresses: (state, action) => {
      state.info.addresses = action.payload;
    },
    addNewAddress: (state, action) => {
      state.info.addresses.push(action.payload);
    }
  }
})

export const {
  addCurrUser,
  removeCurrUser,
  addCartItemToCurrUser,
  removeCartItemFromCurrUser,
  incrementCartItemAmount,
  decrementCartItemAmout,
  clearCart,
  setInvoices,
  addNewInvoice,
  editInvoice,
  setAddresses,
  addNewAddress
} = currUser.actions;
export const selectCurrUser = (state) => state.currUser.info;
export default currUser.reducer;