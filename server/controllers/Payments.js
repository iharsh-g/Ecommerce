const {instance} = require("../config/razorpay");
const mailSender = require("../utils/mailSender");
const User = require("../models/User");
const Order = require("../models/Order")
const mongoose = require("mongoose");
require("dotenv").config();
const crypto = require("crypto");

exports.capturePayment = async(req, res) => {
    const {shippingInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;
    // console.log("Body Data", req.body);

    if(!shippingInfo || !orderItems || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice) {
        return res.status(400).json({success: false, message: "Please provide all details"});
    }

    const options = {
        amount: totalPrice * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(), 
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            message: "Payment Successfull",
            data: paymentResponse
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
    
}

exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;

    const {shippingInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body?.data;
    const userId = req.user.id;

    if( !razorpay_order_id || !razorpay_payment_id || !razorpay_signature || 
        !shippingInfo || !orderItems || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice || !userId) {
        return res.status(400).json({success: false, message: "All Fields required"});
    }

    let body =  razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if(expectedSignature === razorpay_signature) {
        createOrder(shippingInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice, razorpay_payment_id, userId, res);
        return res.status(200).json({success: true, message: "Payment Verified"});
    }

    return res.status(500).json({success: false, message: "Payment Failed"});
}

const createOrder = async(shippingInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice, razorpay_payment_id, userId, res) => {
    try {
        if(!shippingInfo || !orderItems || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice) {
            return res.status(400).json({success: false, message: "Please provide all details"});
        }
    
        //Make order
        const actualShippingInfo = {...shippingInfo, contactNumber: shippingInfo?.phoneNumber};
        const actualOrderItems = [];
    
        //Verify  items
        for(const order of orderItems) {
            const data = {
                name: order?.productName,
                price: order?.productPrice,
                quantity: order?.quantity,
                image: order?.productImage,
                product: order?.productId,
            }
    
            actualOrderItems.push(data);
        }
    
        const paymentInfo =  {
            id: razorpay_payment_id,
            status: 'Succeded',
        }
    
        await Order.create({
            shippingInfo: actualShippingInfo,
            orderItems: actualOrderItems,
            paymentInfo,
            itemsPrice,
            taxPrice: 40,
            shippingPrice,
            totalPrice, 
            paidAt: Date.now(),
            user: userId,
        }) 
    }
    catch(error) {
        return res.status(500).json({success: false, message: "Cannot create Order"});
    }
    
}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;
    const userId = req.user.id;
    
    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success: false, message: "Please provide all the fields"})
    }

    try {
        const user = await User.findById(userId);
        await mailSender(user.email, 'Payment Received - Ecommerce', 
            `${user.name} \n 
            amount: ${amount/100} \n 
            orderId: ${orderId} \n 
            paymentId: ${paymentId}`
        )
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not send mail"
        })
    }
}