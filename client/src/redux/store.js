import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import currUserReducer from './currUserSlice';
import currProductsReducer from './currProductsSlice';
import currCategoriesReducer from './currCategoriesSlice';
import currTagsReducer from './currTagsSlice';


const store = configureStore({
  reducer: {
    modal: modalReducer,
    currUser: currUserReducer,
    currProducts: currProductsReducer,
    currCategories: currCategoriesReducer,
    currTags: currTagsReducer
  }
});

export default store;