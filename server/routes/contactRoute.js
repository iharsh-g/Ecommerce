const express = require("express");
const { contactUs } = require("../controllers/contactUsController");
const router = express.Router();

router.post("/contact", contactUs);

module.exports = router;