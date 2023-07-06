import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,

        allProducts: null,
        productDetails: null,

        allOrders: null,
        orderDetails: null,

        allUsers: null,
        userDetail: null,

        allReviews: null,
    },
    reducers: {
        //All Products
        setProducts(state, value) {
            state.allProducts = value.payload;
        },

        // Product by ID
        setProduct(state, value) {
            state.productDetails = value.payload;
        },

        //  All Orders
        setOrders(state, value) {
            state.allOrders = value.payload;
        },

        // Order by ID
        setOrder(state, value) {
            state.orderDetails = value.payload;
        },

        //  All Users
        setUsers(state, value) {
            state.allUsers = value.payload;
        },
        
        // User by ID
        setUserById(state, value) {
            state.userDetail = value.payload;
        },

        // User by ID
        setReview(state, value) {
            state.allReviews = value.payload;
        },

        setLoading(state, value) {
            state.loading = value.payload;
        }
    },
});

export const { setProducts, setProduct, setOrders, setOrder, setUsers, setUserById, setReview, setLoading } = adminSlice.actions;

export default adminSlice.reducer;