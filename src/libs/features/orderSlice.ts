// Define the initial state using that type
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../interfaces/schema/order/order.interface";
import { OrderFilterQuery } from "@/app/fetch/order.api";

export interface OrdersPayload {
  data: Order[];
  total: number;
  page: number;
}

export interface OrdersState {
  data: Order[];
  total: number;
  page: number;
  filter: OrderFilterQuery;
}

const initialState: OrdersState = {
  data: [],
  total: 0,
  page: 1,
  filter: {
    search: "",
    status: "",
    sort: "-createdAt",
  },
};

export const OrderSlice = createSlice({
  name: "orders",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getOrders: (state, action: PayloadAction<OrdersPayload>) => {
      state.data = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    searchOrders: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    sortOrders: (state, action: PayloadAction<string>) => {
      state.filter.sort = action.payload;
    },
    statusOrders: (state, action: PayloadAction<string>) => {
      state.filter.status = action.payload;
    },
    changeOrderPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearOrderFilter: (state) => {
      state.filter = {
        search: "",
        sort: "-createdAt",
        status: "",
      };
    },
  },
});

export const {
  getOrders,
  searchOrders,
  sortOrders,
  statusOrders,
  changeOrderPage,
  clearOrderFilter
} = OrderSlice.actions;

export default OrderSlice.reducer;
