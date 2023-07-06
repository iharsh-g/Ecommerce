const Product = require("../models/Product");
const ApiFeatures = require("../utils/ApiFeatures");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// --Admin
exports.getProducts = async(req, res) => {
    try {
        const products = await Product.find({});

        return res.status(200).json({
            success: true,
            message: "All Products",
            products
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Product cannot be fetched at this time!",
            error: error.message
        })
    }
}

// ---Admin
exports.createProduct = async(req, res) => {
    try {
        let images = [];
        if (typeof req.body.images === "string") {  //for single image
            images.push(req.body.images);
        } 
        else {
            images = req.body.images;
        }

        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const productImage = await cloudinary.uploader.upload(images[i], {folder: process.env.FOLDER_NAME});
            const productData = {
                public_id: productImage.public_id,
                url: productImage.secure_url,
            }
            imagesLinks.push(productData);
        }

        req.body.user = req.user.id;
        req.body.images = imagesLinks;
        const product = await Product.create(req.body);

        return res.status(200).json({
            success: true,
            message: "Products created successfully",
            product,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Product cannot be created due to internal server problem!",
            error: error.message,
        })
    }
}
 
// ---Admin
exports.updateProduct = async(req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found!"
            })
        }

        const updates = req.body;
        for(const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if(key === 'images') {
                    //delete existing images
                    for(const image of product?.images) {
                        if(image.public_id) {
                            await cloudinary.uploader.destroy(image.public_id, {resource_type: "image"});
                        }
                    }

                    //New Images
                    let images = [];
                    if (typeof updates.images === "string") {  //for single image
                        images.push(req.body.images);
                    } 
                    else {
                        images = req.body.images;
                    }

                    const imagesLinks = [];
                    for (let i = 0; i < images.length; i++) {
                        const productImage = await cloudinary.uploader.upload(images[i], {folder: process.env.FOLDER_NAME});
                        const productData = {
                            public_id: productImage.public_id,
                            url: productImage.secure_url,
                        }
                        imagesLinks.push(productData);
                    }

                    product[key] = imagesLinks;
                }
                else {
                    product[key] = updates[key];
                }
            }
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Updation not possible",
            error: error.message
        })
    }
}

//--Admin
exports.deleteProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found!",
            });
        }

        for(const image of product?.images) {
            if(image.public_id) {
                await cloudinary.uploader.destroy(image.public_id, {resource_type: "image"});
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Deletion not possible",
            error: error.message
        })
    }
}

exports.getProduct = async(req, res) => {
    try {
        const productDetails = await Product.find({_id: req.params.id});
        if (!productDetails) {
            return res.status(400).json({
                success: false,
                message: "Product not found!",
            });
        }

        return res.status(200).json({
            success: true,
            productDetails,
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Products cannot fetched due to internal server problem!",
            error: error.message
        })
    }
}

exports.getAllProducts = async(req, res) => {
    try {
        const resultPerPage = 8;
        const productCounts = await Product.countDocuments();

        const apiFeature = new ApiFeatures(Product.find(), req.query)
            .searchProduct().filterProduct();

        apiFeature.pagination(resultPerPage);
        
        let productDetails = await apiFeature.query;
        const filteredProductCount = productDetails.length;
        
        // productDetails = await apiFeature.query;

        return res.status(200).json({
            success: true,
            data: productDetails,
            productCounts,
            resultPerPage,
            filteredProductCount
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Products cannot fetched due to internal server problem!",
            error: error.message
        })
    }
}

// const productCounts = await Product.countDocuments();

//         const apiFeature = new ApiFeatures(Product.find(), req.query).searchProduct().filterProduct();


//         let productDetails = await apiFeature.query; //calling api feature in db
//         let filteredProductCount = productDetails.length;

//         apiFeature.pagination(resultPerPage);
        
//         productDetails = await apiFeature.query;

//         return res.status(200).json({
//             success: true,
//             data: productDetails,
//             productCounts,
//             resultPerPage,
//             filteredProductCount
//         })

//Create review or update review
exports.createProductReview = async(req, res) => {
    try {
        const {rating, comment, productId} = req.body;
        const review = {
            user: req.user.id,
            name: req.user.name,
            rating: Number(rating),
            comment: comment
        }

        const productDetails = await Product.findById(productId);

        const isReviewed = productDetails.reviews.find((rev) => rev.user.toString() === req.user.id.toString());
        if(isReviewed) { 
            //if already reviewd then update it while traversing the reviews array
            productDetails.reviews.forEach((rev) => {
                if(rev.user.toString() === req.user.id.toString()) {
                    rev.rating = rating;
                    rev.comment = comment;
                }
            })
        }
        else { 
            //Make a review
            productDetails.reviews.push(review);

            //Set total no of reviews = length of the reviews array
            productDetails.numOfReviews = productDetails.reviews.length;
        }

        let averageRating = 0;
        productDetails.reviews.forEach((rev) => {
            averageRating += rev.rating;
        })
        averageRating /= productDetails.reviews.length;

        //Update average rating of the product
        productDetails.ratings = averageRating;

        await productDetails.save();

        return res.status(200).json({
            success: true,
            message: "Review added successfully!",
            productDetails
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Review cannot be added!",
            error: error.message
        })
    }
}

// Get All Reviews of a product
exports.getProductReviews = async(req, res) => {
    try {
        const productDetails = await Product.findById({_id: req.params.id}).populate({
            path: 'reviews.user',
            select: 'email'
        });
  
        if (!productDetails) {
            return res.status(400).json({
                success: false,
                message: "Product not found",
            }) 
        }
      
        return res.status(200).json({
            success: true,
            reviews: productDetails.reviews
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Can't fetch reviews!",
            error: error.message
        })
    }
}

//Delete review
exports.deleteReview = async(req, res) => {
    try {
        const { productId, reviewId } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $pull: { reviews: { _id: reviewId } },
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(400).json({
                success: false,
                message: "Product not found",
            });
        }

        const numOfReviews = updatedProduct.reviews.length;
        const totalRating = updatedProduct.reviews.reduce((acc, rev) => acc + rev.rating, 0) / numOfReviews;

        updatedProduct.numOfReviews = numOfReviews;
        updatedProduct.ratings = totalRating;

        await Product.findByIdAndUpdate(
            productId,
            { numOfReviews: numOfReviews, ratings: totalRating },
            { new: true }
          );

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Can't delete review!",
            error: error.message
        })
    }
} 