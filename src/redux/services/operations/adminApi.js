import { toast } from "react-hot-toast";
import { products, user, orders } from "../api";
import { setLoading, setOrder, setOrders, setProduct, setProducts, setReview, setUserById, setUsers } from "../../slices/adminSlice";
import { apiConnector } from "../apiConnector";

const { ADMIN_FETCH_PRODUCTS, ADMIN_CREATE_PRODUCT, FETCH_PRODUCT_WITH_ID, ADMIN_UPDATE_PRODUCT, ADMIN_DELETE_PRODUCT,
        GET_REVIEWS, DELETE_REVIEW } = products;
const { ADMIN_ALL_USERS, ADMIN_USER } = user;
const { ADMIN_ALL_ORDERS, ADMIN_UPDATE_ORDER, ADMIN_DELETE_ORDER, FETCH_ORDER_WITH_ID } = orders;


/* ************************************************************************ PRODUCTS ******************************************************************
***************************************************************************************************************************************************************
*/
// Admin - all products
export function fetchProducts() {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", ADMIN_FETCH_PRODUCTS);

            if(response.data.success) {
                dispatch(setProducts(response.data.products))
            }
        }
        catch(e) {
            toast.error(e.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - create Product
export function createProduct(data, navigate, token) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", ADMIN_CREATE_PRODUCT, data, {
                "Content-Type": "multipart/form-data",
            });

            if(response.data.success) {
                toast.success("Product Created Successfully");
                navigate("/admin/products");
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
            console.log(error);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - Fetch Product by Id
export function fectchProductDetails(id) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", `${FETCH_PRODUCT_WITH_ID}/${id}`);

            if(response.data.success) {
                dispatch(setProduct(response.data.productDetails[0]));
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - Update Product
export function updateProduct(id, data, navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        // console.log("Updated Data", [...data])

        try {
            const response = await apiConnector("PUT", `${ADMIN_UPDATE_PRODUCT}/${id}`, data, {
                "Content-Type": "multipart/form-data",
            });

            if(response.data.success) {
                toast.success("Product Updated Successfully");
                navigate("/admin/products");
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
            console.log(error);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - Delete Product
export function deleteProduct(id, navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", `${ADMIN_DELETE_PRODUCT}/${id}`);

            if(response.data.success) {
                toast.success("Product Deleted Successfully");
                navigate("/admin/products");
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

/* ************************************************************************ ORDERS ******************************************************************
***************************************************************************************************************************************************************
*/
// Admin - all orders
export function fetchOrders() {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", ADMIN_ALL_ORDERS);

            if(response.data.success) {
                dispatch(setOrders(response.data.orders))
            }
        }
        catch(e) {
            toast.error(e.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - Fetch Order by Id
export function fetchOrderDetails(id) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", `${FETCH_ORDER_WITH_ID}/${id}`);

            if(response.data.success) {
                dispatch(setOrder(response.data.orderDetails));
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - Update Order
export function updateOrder(id, status, navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", `${ADMIN_UPDATE_ORDER}/${id}`, {status});

            if(response.data.success) {
                toast.success("Order Updated Successfully");
                navigate("/admin/orders");
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - Delete Order
export function deleteOrder(id, navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", `${ADMIN_DELETE_ORDER}/${id}`);

            if(response.data.success) {
                toast.success("Order Deleted Successfully");
                navigate("/admin/orders");
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

/* ************************************************************************ USERS ******************************************************************
***************************************************************************************************************************************************************
*/
// Admin - all Users
export function fetchUsers() {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", ADMIN_ALL_USERS);

            if(response.data.success) {
                dispatch(setUsers(response.data.allUsers))
            }
        }
        catch(e) {
            toast.error(e.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - User by ID
export function fetchUser(id) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", `${ADMIN_USER}/${id}`);

            if(response.data.success) {
                dispatch(setUserById(response.data.userDetails))
            }
        }
        catch(e) {
            toast.error(e.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - Update User
export function updateUser(id, role, navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", `${ADMIN_USER}/${id}`, {role});

            if(response.data.success) {
                toast.success("User Updated Successfully");
                navigate("/admin/users");
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - Delete User
export function deleteUser(id, navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", `${ADMIN_USER}/${id}`);

            if(response.data.success) {
                toast.success("User Deleted Successfully");
                navigate("/admin/users");
            }
        }
        catch(error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

/* ************************************************************************ REvIEWS ******************************************************************
***************************************************************************************************************************************************************
*/

// Admin - all reviews of a product
export function fetchReviews(id) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", `${GET_REVIEWS}/${id}`);

            if(response.data.success) {
                dispatch(setReview(response.data.reviews))
            }
        }
        catch(e) {
            console.log(e);
            toast.error(e.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

// Admin - deleteReview
export function delelteReview(productId, reviewId, navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_REVIEW, {productId, reviewId});

            if(response.data.success) {
                toast.success("Review Deleted Successfully");
                navigate("/admin/reviews");
            }
        }
        catch(e) {
            toast.error(e.response.data.message);
        }

        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}