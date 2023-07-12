import { toast } from 'react-hot-toast';
import { user } from "../api";
import { apiConnector } from '../apiConnector'
import { setUser, setLoading } from "../../slices/userSlice";
import { setToken } from '../../slices/authSlice';
import { clearCartItems } from '../../slices/cartSlice';

const { CHANGE_PASSWORD, FORGOT_PASSWORD, FORGOT_PASSWORD_TOKEN, LOGOUT, LOGIN, SIGNUP,
        UPDATE_USER_NAME, USER_DETAILS, AUTHENTICATED_USER} = user;

// Authentication
export async function authenticatedUser(token, navigate) {
    let result = false;
    try { 
        const response = await apiConnector("GET", AUTHENTICATED_USER,  null, { Authorization: `Bearer ${token}`});

        if(!response.data.success) {
            throw new Error("User is not autheticated");
        }  

        result = true;
    }
    catch (error) {
        toast.error("Can't fetch Details");
    }

    return result;
}

// Signup
export function signupUser(body, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try { 
            const response = await apiConnector("POST", SIGNUP, body);

            if(response.data.success) {
                toast.success("Registration Successfull");
                navigate("/login");
            }  
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}

// Login
export function loginUser(data) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", LOGIN, data);

            if(response.data.success) {
                localStorage.setItem("token", JSON.stringify(response.data.token));

                dispatch(setToken(response.data.token));
                toast.success("Login Successfull");

                dispatch(setUser(response.data.user));
            }     
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}

// Log out User
export function logoutUser(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            localStorage.removeItem("token");

            const respone = await apiConnector("GET", LOGOUT, null, { Authorization: `Bearer ${token}` }, null);

            if(respone.data.success) {
                dispatch(setToken(null));
                dispatch(setUser(null));
                dispatch(clearCartItems());
                localStorage.removeItem("subTotal");
                localStorage.removeItem("gst");
                localStorage.removeItem("grossTotal");
                
                toast.success("Loggout Successfully");
                navigate("/");
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}

// Change Password 
export function changePassword(data, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            await apiConnector("PUT", CHANGE_PASSWORD, data);

            toast.success("Password Updated Successfully");
            navigate("/account");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}

// Forgot Password
export function forgotPassword(email, setEmailSent) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", FORGOT_PASSWORD, {email});

            if(response.data.success) {
                toast.success("Email Sent Successfully");
            }

            setEmailSent(true);
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}

// Forgot Passswrod Token
export function forgotPasswordToken(newPassword, confirmPassword, token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", `${FORGOT_PASSWORD_TOKEN}/${token}`, {
                newPassword, confirmPassword
            });

            if(response.data.success) {
                toast.success("Password Changed Successfully");
            }

            navigate("/login");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}

// User Details
export function fetchUserDetails(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", USER_DETAILS, null, { Authorization: `Bearer ${token}` }, null);

            if(response.data.userDetails) {
                dispatch( setUser(response.data.userDetails) );
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}

// Update User Name
export function updateUserName(name) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_USER_NAME, {name});

            if(response.data.success) {
                toast.success("Name changed Successfull");
                dispatch(fetchUserDetails());
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}

