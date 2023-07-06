import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartDetails: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
        cartLoading: false,
        step: 1,
        shippingDetails: null,
    },
    reducers: {
        //Addition of an item
        addItem(state, value) {
            if (!state.cartDetails) {
                state.cartDetails = []; // Initialize cartDetails if it's undefined
            }
            state.cartDetails.push(value.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartDetails));
        },

        //updattion of an item
        updateItem(state, action) {
            const updatedCartItem = action.payload;
            const existingCartItemIndex = state.cartDetails.findIndex(
                (item) => item.productId === updatedCartItem.productId
            );
            if (existingCartItemIndex !== -1) {
                state.cartDetails[existingCartItemIndex] = updatedCartItem;
                localStorage.setItem("cartItems", JSON.stringify(state.cartDetails));
            }
        },

        //removal of an item
        removeItem(state, value) { 
            state.cartDetails = state.cartDetails.filter((item) => item.productId !== value.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartDetails));
        },

        //clearing of the cart
        clearCartItems(state, value) {
            state.cartDetails = value.payload;
            localStorage.removeItem("cartItems");
        },

        setCartLoading(state, value) {
            state.cartLoading = value.payload;
        },

        setStep(state, value) {
            state.step = value.payload;
        },
        
        setShippingDetails(state, value) {
            state.shippingDetails = value.payload;
        }
    }
})

export const { addItem, updateItem, removeItem, clearCartItems, setCartLoading, setStep, setShippingDetails } = cartSlice.actions;
export default cartSlice.reducer;