// Define the initial state using that type

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../interfaces/schema/category/category.interface";

export interface CategoryState {
  data: Category[];
}

const initialState: CategoryState = {
  data: [],
};

export const CategorySlice = createSlice({
  name: "category",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getCategories: (state, action: PayloadAction<Category[]>) => {
      state.data = action.payload;
    },
    createCategory: (state, action: PayloadAction<Category>) => {
      state.data.push(action.payload)
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const category = state.data.find(item => item._id === action.payload._id)
      if (category) {
        // This object is still wrapped in a Proxy, so we can "mutate" it
        Object.assign(category, action.payload)
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      const newData = state.data.filter(item => item._id !== action.payload)

      state.data = newData;
    },
  },
});

export const { getCategories, createCategory, updateCategory, deleteCategory } = CategorySlice.actions;

export default CategorySlice.reducer;