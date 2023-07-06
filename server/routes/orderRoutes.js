const express = require("express");
const router = express.Router();

const { createOrder, getSingleOrder, myOrders, 
        getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");

const { auth, isAdmin } = require("../middlewares/auth")

router.post("/order/new", auth, createOrder);
router.get("/order/:orderId", auth, getSingleOrder);
router.get("/orders/me", auth, myOrders);

router.get("/admin/orders", auth, isAdmin, getAllOrders);
router.put("/admin/order/:orderId", auth, isAdmin, updateOrderStatus);
router.delete("/admin/order/:orderId", auth, isAdmin, deleteOrder);

module.exports = router;