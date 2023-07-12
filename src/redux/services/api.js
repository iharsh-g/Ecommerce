const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const user = {
    LOGIN: BASE_URL + '/login',
    SIGNUP: BASE_URL + '/signup',
    LOGOUT: BASE_URL + '/logout',
    CHANGE_PASSWORD: BASE_URL + '/password/change',
    FORGOT_PASSWORD: BASE_URL + '/password/forgot',
    FORGOT_PASSWORD_TOKEN: BASE_URL + '/password/reset',

    USER_DETAILS: BASE_URL + '/me',
    UPDATE_USER_NAME: BASE_URL + '/me/updateProfile',

    ADMIN_ALL_USERS: BASE_URL + '/admin/users',
    ADMIN_USER: BASE_URL + '/admin/user',
    AUTHENTICATED_USER: BASE_URL + '/authenticated'
}

export const products = {
    FETCH_PRODUCTS: BASE_URL + `/products`,
    FETCH_PRODUCT_WITH_ID:BASE_URL + `/product`,

    ADD_REVIEW: BASE_URL + '/review',
    GET_REVIEWS: BASE_URL + '/reviews',
    DELETE_REVIEW: BASE_URL + '/reviews',

    ADMIN_FETCH_PRODUCTS: BASE_URL + '/admin/products',
    ADMIN_CREATE_PRODUCT: BASE_URL + '/admin/product/new',
    ADMIN_UPDATE_PRODUCT: BASE_URL + '/admin/product',
    ADMIN_DELETE_PRODUCT: BASE_URL + '/admin/product',
}

export const orders = {

    FETCH_ORDER_WITH_ID: BASE_URL + `/order`,
    FETCH_ORDERS: BASE_URL + '/orders/me',

    ADMIN_ALL_ORDERS: BASE_URL + '/admin/orders',
    // ADMIN_CREATE_ORDER: BASE_URL + '/admin/order/new',
    ADMIN_UPDATE_ORDER: BASE_URL + '/admin/order',
    ADMIN_DELETE_ORDER: BASE_URL + '/admin/order',
}

// PAYMENT ENDPOINTS
export const paymentEndpoints = {
    PRODUCT_PAYMENT_API: BASE_URL + "/capturePayment",
    PRODUCT_VERIFY_API: BASE_URL + "/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/sendPaymentSuccessEmail",
}

export const contact = {
    CONTACT_US: BASE_URL + '/contact'
}