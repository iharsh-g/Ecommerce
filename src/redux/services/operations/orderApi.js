import { toast } from "react-hot-toast";
import { orders } from "../api";
import { apiConnector } from "../apiConnector";

const { FETCH_ORDERS, FETCH_ORDER_WITH_ID } = orders

export async function fetchUserOrders(token) {
    let result = [];

    try {
        const response = await apiConnector("GET", FETCH_ORDERS, null, { Authorization: `Bearer ${token}`});

        if(!response?.data?.success) {
            throw new Error("Could not get Orders");
        }

        result = response?.data?.orderDetails;
    }
    catch(error) {
        console.log(error);
        toast.error("Can't fetch orders");
    }

    return result;
}

export async function fetchSingleOrder(id, token) {
    let result = [];

    try {
        const response = await apiConnector("GET", `${FETCH_ORDER_WITH_ID}/${id}`, null, { Authorization: `Bearer ${token}`});

        if(response.data.success) {
            result = response.data.orderDetails;
        }
    }
    catch(error) {
        console.log(error)
    }

    return result;
}