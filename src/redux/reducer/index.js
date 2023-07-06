import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import productReducer from "../slices/productSlice";
import userReducer from "../slices/userSlice";
import cartReducer from "../slices/cartSlice";
import adminReducer from "../slices/adminSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    products: productReducer,
    user: userReducer,
    cart: cartReducer,
    admin: adminReducer,
});

export default rootReducer