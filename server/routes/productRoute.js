const express = require("express");
const router = express.Router();

const { createProduct, updateProduct, deleteProduct,
        getAllProducts,  getProduct, 
        createProductReview, getProductReviews, deleteReview, getProducts } = require("../controllers/productController");

const { auth, isAdmin } = require("../middlewares/auth");

//Admin work
router.post("/admin/product/new", auth, isAdmin, createProduct);
router.put("/admin/product/:id", auth, isAdmin, updateProduct);
router.delete("/admin/product/:id", auth, isAdmin, deleteProduct);
router.get("/admin/products", auth, isAdmin, getProducts);

//Products
router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);

//Reviews
router.put("/review", auth, createProductReview); 
router.get("/reviews/:id", getProductReviews)
router.delete("/reviews", auth, deleteReview)

module.exports = router; 