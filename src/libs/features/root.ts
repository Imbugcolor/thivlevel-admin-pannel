import authReducer from "./authSlice";
import notifyReducer from './notifySlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';

export const RootReducers = {
    auth: authReducer,
    notify: notifyReducer,
    products: productReducer,
    categories: categoryReducer,
}