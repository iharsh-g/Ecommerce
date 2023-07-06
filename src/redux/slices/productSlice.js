import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "products",
    initialState: {
        isLoading: false,
        allProducts: null,
        productDetails: null,
        filteredProducts: null,
    },
    reducers: {
        //All Products
        getProducts(state, value) {
            state.allProducts = value.payload;
        },

        // Product by ID
        getProduct(state, value) {
            state.productDetails = value.payload;
        },

        // Filtered Product
        getFilteredProducts(state, value) {
            state.filteredProducts = value.payload;
        },

        setProductLoading(state, value) {
            state.isLoading = value.payload;
        }
    },
});

export const { getProducts, getProduct, getFilteredProducts, setProductLoading } = productSlice.actions;

export default productSlice.reducer;