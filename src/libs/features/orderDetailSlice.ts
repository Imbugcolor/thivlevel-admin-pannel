// Define the initial state using that type
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../interfaces/schema/order/order.interface";
import { AddressFullObject, ShippingAddress } from "../interfaces/schema/address.interface";
import { UpdateOrder } from "@/app/fetch/order.api";

export interface OrderDetailState {
  data_cached: Order[];
}

const initialState: OrderDetailState = {
  data_cached: [],
};

interface UpdateOrderStatus {
    id: string,
    status: string,
}

interface UpdateOrderDetail extends UpdateOrder {
    id: string
}

export const OrderDetailSlice = createSlice({
  name: "orderdetail",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getOrder: (state, action: PayloadAction<Order>) => {
        if(state.data_cached.find(data => data._id === action.payload._id)) return state;
        state.data_cached.push(action.payload)
    },
    updateStatus: (state, action: PayloadAction<UpdateOrderStatus>) => {
        const order = state.data_cached.find(data => data._id === action.payload.id)
        if(order) {
            order.status = action.payload.status;
            if (action.payload.status === 'Completed') {
              order.isPaid = true;
            }
        }
    },
    updateOrder:  (state, action: PayloadAction<UpdateOrderDetail>) => {
      const order = state.data_cached.find(data => data._id === action.payload.id)
      const { id, ...update } = action.payload
      if(order) {
          Object.assign(order, update)
      }
  },
  }
});

export const { 
    getOrder, updateStatus, updateOrder
} = OrderDetailSlice.actions;

export default OrderDetailSlice.reducer;