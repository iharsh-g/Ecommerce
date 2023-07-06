//middlewares -> auth, student, instructor
const jwt = require("jsonwebtoken");
require("dotenv").config();

//authentication
exports.auth = async(req, res, next) => {
    try {
        //extract        
        // console.log("cookie" , req.cookies.token);
        // console.log("body", req.body.token);
        // console.log("header", req.header("Authorization").replace("Bearer ", ""))

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        //verify
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("decode-> ", decode);
            req.user = decode;
        }
        catch(e) {
            return res.status(401).json({
                success: false,
                message: "token is invalid",
            });
        }
        next();
    }
    catch(error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
}

exports.isUser = async(req, res, next) => {
    try {
        if(req.user.role !== "User") {
            return res.status(401).json({
                success: false,
                message: "This is the protected routes for User only",
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified",
        });
    }
}

exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is the protected routes for admin only",
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified",
        });
    }
}