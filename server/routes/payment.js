const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/auth");
const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments");

router.post("/capturePayment", auth, capturePayment);
router.post("/verifyPayment", auth, verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail);

module.exports = router;