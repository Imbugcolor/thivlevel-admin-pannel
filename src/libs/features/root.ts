import authReducer from "./authSlice";
import notifyReducer from './notifySlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import orderReducer from './orderSlice';
import orderDetailReducer from './orderDetailSlice';
import clientReducer from './clientSlice';
import notificationReducer from './notificationSlice';
import userReducer from './userSlice';

export const RootReducers = {
    auth: authReducer,
    notify: notifyReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    orderDetail: orderDetailReducer,
    client: clientReducer,
    notification: notificationReducer,
    users: userReducer,
}