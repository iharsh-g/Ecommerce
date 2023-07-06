import { toast } from 'react-hot-toast';
import { paymentEndpoints } from '../api'
import { apiConnector } from "../apiConnector";
import { clearCartItems } from '../../slices/cartSlice';
// import rzpLogo from '../../assets/Logo/rzp_lo'

const { PRODUCT_PAYMENT_API, PRODUCT_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = paymentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);
    })
}

export async function buyProducts(data, token, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");

    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res) {
            toast.error("Razorpay SDK Failed to load");
        }

        //initiate order
        const orderResponse = await apiConnector("POST", PRODUCT_PAYMENT_API, data, { Authorization: `Bearer ${token}`});
        // console.log("Order Response------", orderResponse);

        if(!orderResponse.data.success) {
            throw new Error(orderResponse?.data?.message);
        }

        //options
        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "Ecommerce",
            description: "Thank You for purchasing the products",
            prefill: {
                name: `${userDetails.name}`,
                email: userDetails.email
            },
            handler: function(response) {
                //send sccesssfull
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);

                verifyPayment({...response, data}, token, navigate, dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("Payment Failed", function(response) {
            toast.error("Oops! Payment Failed");
            console.log(response);
        })
         
    }
    catch(error) {
        console.log("Payment error----------", error);
        toast.error("Could not make payment");
    }

    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount
        }, { Authorization: `Bearer ${token}`})
    }
    catch(error) {
        console.log("Payment Sucess email error", error);
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    // console.log("Body Data", bodyData);

    try {
        const response = await apiConnector("POST", PRODUCT_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`
        });
        // console.log("Verify Payment wala function", response)

        if(!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment Successfull");
        dispatch(clearCartItems()); 
        localStorage.removeItem("subTotal");
        localStorage.removeItem("grossTotal");
        localStorage.removeItem("gst");
        navigate("/");
    }
    catch(error) {
        console.log("Payment verify error -----", error);
        toast.error("Could not verify payment");
    }

    toast.dismiss(toastId);
}