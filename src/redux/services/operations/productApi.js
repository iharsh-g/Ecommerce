import { toast } from "react-hot-toast";
import { products } from "../api";
import { apiConnector } from "../apiConnector";
import { getFilteredProducts, getProduct, getProducts, setProductLoading } from "../../slices/productSlice";

const { ADD_REVIEW, FETCH_PRODUCTS, FETCH_PRODUCT_WITH_ID } = products

// Fetch "Products" using keyword for Search, and for Home
export function fetchProducts(isSearch, keyword, token) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setProductLoading(true));

        try {
            let response;
            if(isSearch) {
                response = await apiConnector("GET", FETCH_PRODUCTS, null, { Authorization: `Bearer ${token}`}, {
                    keyword: keyword,
                });
            }
            else {
                response = await apiConnector("GET", FETCH_PRODUCTS, null, { Authorization: `Bearer ${token}`}, {
                    keyword: '',
                    page: 1,
                    price: { gte: 2000, lte: 190000 },
                    ratings: { gte: 0 }
                });
            }


            if(response.data.success) {
                dispatch(getProducts(response.data.data));
            }

        }
        catch (error) {            
            toast.error(error.response?.data?.message);
        }

        toast.dismiss(toastId)
        dispatch(setProductLoading(false));
    }
}

// Fetch Filtered Products
export function fetchFilterProducts(category, currentPage, value, rating, token) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setProductLoading(true));

        try {

            let response;
            if(category === "All") {
                response = await apiConnector("GET", FETCH_PRODUCTS, null, { Authorization: `Bearer ${token}`}, {
                    keyword: '',
                    page: currentPage,
                    price: { gte: value[0], lte: value[1] },
                    ratings: { gte: rating },
                });
            }
            else {
                response = await apiConnector("GET", products.FETCH_PRODUCTS, null, { Authorization: `Bearer ${token}`}, {
                    keyword: '',
                    page: currentPage,
                    price: { gte: value[0], lte: value[1] },
                    ratings: { gte: rating },
                    category: category,
                });
            }

            if (response.data.data) {
                dispatch(getFilteredProducts(response.data));
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setProductLoading(false));
    }
}

// Fetch Product by ID
export function fetchProductById(productId, token) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setProductLoading(true));

        try {
            const response = await apiConnector("GET", `${FETCH_PRODUCT_WITH_ID}/${productId}`, null, { Authorization: `Bearer ${token}`});

            if (response.data.success) {
                dispatch(getProduct(response.data.productDetails[0]));
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setProductLoading(false));
    }
}

// Create or Update the review
export function addOrUpdateReview(productId, rating, review, token) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setProductLoading(true));

        try {
            const response = await apiConnector("PUT", ADD_REVIEW, {
                productId, rating, 
                comment: review
            }, { Authorization: `Bearer ${token}`});

            if(response.data.success) {
                toast.success(response.data.message);
            }

        }
        catch (error) {            
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setProductLoading(false));
    }
}

