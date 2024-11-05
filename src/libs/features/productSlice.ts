// Define the initial state using that type

import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../interfaces/schema/product/product.interface";
import { ProductsFilterOptions } from "@/app/fetch/product.api";

export interface ProductPayload {
  data: Product[];
  total: number;
  page: number;
}

export interface ProductState {
  data: Product[];
  total: number;
  page: number;
  filter: ProductsFilterOptions;
}

const initialState: ProductState = {
  data: [],
  total: 0,
  page: 1,
  filter: {
    search: "",
    sort: "",
    category: "",
    'price[gte]': "",
    'price[lte]': "",
    sizes: [],
  },
};

export const ProductSlice = createSlice({
  name: "product",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getProducts: (state, action: PayloadAction<ProductPayload>) => {
      state.data = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    searchProducts: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    sortProducts: (state, action: PayloadAction<string>) => {
      state.filter.sort = action.payload;
    },
    filterCategory: (state, action: PayloadAction<string>) => {
      state.filter.category = action.payload;
    },
    filterPrice: (state, action: PayloadAction<{ fromPrice?: string, toPrice?: string }>) => {
      if (action.payload.fromPrice === '') {
        state.filter["price[gte]"] = ''
      }

      if (action.payload.toPrice === '') {
        state.filter["price[lte]"] = ''
      }
      if (action.payload.fromPrice) {
        state.filter["price[gte]"] = action.payload.fromPrice;
      }

      if (action.payload.toPrice) {
        state.filter["price[lte]"] = action.payload.toPrice;
      }
    },
    filterSizes: (state, action: PayloadAction<string[]>) => {
      state.filter.sizes = action.payload;
    },
    removeAllFilter: (state) => {
      state.filter = {
        search: "",
        sort: "",
        category: "",
        "price[gte]": "",
        "price[lte]": "",
        sizes: [],
      }
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    updatePublish: (state, action: PayloadAction<{ id: string, isPublised: boolean}>) => {
      const { id, isPublised } = action.payload;
      const product = state.data.find((product) => product._id === id);
  
      if (product) {
        // Apply the updates to the found todo
        product.isPublished = isPublised
      }
    },
    deleteProductAction: (state, action: PayloadAction<string>) => {
      const product = state.data.filter((product) => product._id !== action.payload);
  
      state.data = product;
      state.total = state.total - 1;
    },
  },
});

export const { 
  getProducts, searchProducts, 
  sortProducts, filterCategory, 
  filterPrice, filterSizes, 
  removeAllFilter, changePage,
  updatePublish, deleteProductAction
} = ProductSlice.actions;

export default ProductSlice.reducer;