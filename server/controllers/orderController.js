const Order = require("../models/Order");
const Product = require("../models/Product");

//New order
exports.createOrder = async(req, res) => {
    try {
        const { shippingInfo, orderItems, paymentInfo,
            itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
         
        const orderDetails = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice, 
            paidAt: Date.now(),
            user: req.user.id,
        }) 

        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            orderDetails
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Order cannot be created!",
            error: error.message,
        })
    }
}

//GET Single Order
exports.getSingleOrder = async(req, res) => {
    try {
        const orderDetails = await Order.findById(req.params.orderId).populate("user", "name email");
        if(!orderDetails) {
            return res.status(404).json({
                success: false,
                message: "Order with this ID does not exists",
            })
        }

        return res.status(200).json({
            success: true,
            orderDetails,
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Order cannot be fetched!",
            error: error.message,
        })
    }
}

//GET All orders of logged in user
exports.myOrders = async(req, res) => {
    try {
        const orderDetails = await Order.find({user: req.user.id});
        if(!orderDetails) {
            return res.status(400).json({
                success: false,
                message: "Orders with this USER ID does not exists",
            })
        }

        return res.status(200).json({
            success: true,
            orderDetails,
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Orders cannot be fetched!",
            error: error.message,
        })
    }
}

//GET all orders -- ADMIN
exports.getAllOrders = async(req, res) => {
    try {
        const orderDetails = await Order.find({}).populate("user").exec();
        if(!orderDetails) {
            return res.status(400).json({
                success: false,
                message: "Orders does not exists",
            })
        }

        return res.status(200).json({
            success: true,
            orders: orderDetails
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Orders cannot be fetched!",
            error: error.message,
        })
    }
}

//Update Order Status -- ADMIN
exports.updateOrderStatus = async(req, res) => {
    try {
        const orderDetails = await Order.findById(req.params.orderId);
        const {status} = req.body;

        if(!orderDetails) {
            return res.status(404).json({
                success: false,
                message: "Orders with this USER ID does not exists",
            })
        }

        if(orderDetails.orderStatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "This order is already delivered",
            })
        }

        if(!status) {
            return res.status(400).json({
                success: false,
                message: "Please provide status which has to be update",
            })
        }

        if(req.body.status === "Shipped") {
            orderDetails.orderItems.forEach(async (order) => {
                await updateStock(order.product, order.quantity);
            });
        }
        orderDetails.orderStatus = req.body.status;  //it can run whether the req is Shipped or Delivered

        if(req.body.status === "Delivered") {
            orderDetails.deliveredAt = Date.now();
        }

        await orderDetails.save();

        return res.status(200).json({
            success: true,
            message: "Status Updated successfully"
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Order status cannot be update!",
            error: error.message,
        })
    }

    async function updateStock(productId, productQuantity) {
        const productDetails = await Product.findById(productId);
        productDetails.stock -= productQuantity;

        await productDetails.save();
    }
}

//Delete Order -- ADMIN
exports.deleteOrder = async(req, res) => {
    try {
        const orderDetails = await Order.findById(req.params.orderId);
        if(!orderDetails) {
            return res.status(404).json({
                success: false,
                message: "Orders does not exists",
            })
        }

        await orderDetails.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Orders cannot be delete!",
            error: error.message,
        })
    }
}
