const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");

exports.signUp = async(req, res) => {
    try {
        const {name, email, password, role, avatar} = req.body;

        if(!name || !email || !password || !role) {
            return res.status(400).json({
                success:false,
                message: "All fields are required",
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const userDetails = await User.create({
            name, email, password: hashedPass,
            role: role,
            avatar
        })

        return res.status(200).json({
            success:true,
            message: "Registration successfull",
            userDetails
        })
    }
    catch (error) {
        return res.status(500).json({
            success:false,
            message: "Cannot signup",
            error: error.message,
        })
    }
}

exports.login = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message: "All fields are required",
            })
        }

        let user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }

        if(await bcrypt.compare(password, user.password)) {
            //payload for token
            const payload = {email: user.email, id: user._id, role: user.role, name: user.name};
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),  //3days
                httpOnly: true,
            };

            //generate cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token, 
                user,
                message: "Logged in Successfully"
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is inncorrect",
            });
        }
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message: "Cannot signin",
            error: error.message,
        })
    }
}

exports.logout = async(req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })

        res.status(200).json({
            success: true,
            message: "Logged Out Successfully",
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message: "Cannot logout",
            error: error.message,
        })
    }
}

exports.resetPasswordToken = async(req, res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Email is not registered",
            });
        }

        // console.log("User: ", user);

        const token = crypto.randomBytes(20).toString('hex');
        // console.log("TOken", token);

        const updatedDetails = await User.findOneAndUpdate({email: email}, {
            resetPasswordToken: token,
            resetPasswordExpire: Date.now() + 10*60*1000, //10min
        }, {new: true});

        const url = `http://localhost:3000/password/forgot/${token}`;  //this url is for frontend

        await mailSender(email, "Ecommerce Password Recovery", `Password Reset Link: ${url} \n\n\n Please note that, this link is valid for 10 mins.`);

        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please check email and reset password",
            updatedDetails
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending mail for reset password",
        });
    }
}

exports.resetPassword = async(req, res) => {
    try {
        const {newPassword, confirmPassword} = req.body;
        if(newPassword !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Password not matching",
            });
        }

        const userDetails = await User.findOne({resetPasswordToken: req.params.token});
        if(!userDetails) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }

        if(userDetails.resetPasswordExpire < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "Token is expired, Regenerate the mail",
            });
        }
 
        const hashedPass = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({resetPasswordToken: req.params.token}, {
            password: hashedPass,
        }, {new: true});

        
        userDetails.resetPasswordToken = undefined;
        userDetails.resetPasswordExpire = undefined;

        await userDetails.save(); // Save the changes to the document

        return res.status(200).json({
            success: true,
            message: "Password reset Successsfully",
        });

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reseting password",
        });
    }
}

exports.getUserDetails = async(req, res) => {
    try {
        const userId = req.user.id;  //if signned in

        const userDetails = await User.findById(userId);
        if(!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User does not exists",
            });
        }

        return res.status(200).json({
            success: true,
            userDetails,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting user Details",
            error: error.message
        });
    }
}


exports.changePassword = async(req, res) => {
    //get email, oldPass, new pass, confirm pass
    try {
        const {oldPassword, newPassword, confirmPassword} = req.body;

        //validate
        if(!oldPassword || !newPassword || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            });
        }
    
        const email = req.user.email;
        const user = await User.findOne({email});  //only work when user logged in
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }
    
        if(newPassword !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Password does not match",
            });
        }

        if(await bcrypt.compare(oldPassword, user.password)) {
            //update pwd in DB
            const hashedPass = await bcrypt.hash(newPassword, 10);
            await User.findOneAndUpdate({email}, {
                password: hashedPass,
            }, {new: true});

            //sendmail -> passwordUpdated
            await mailSender(email, "Password Changed Successfully", `Your password of Ecommerce platform has been changed successfully!`);

            return res.status(200).json({
                success: true,
                message: "Password Changed Succesfully",
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Incorrect old Password",
            });
        }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while changing password",
            error: error.message
        });
    }
}

exports.updateProfile = async(req,  res) => {
    try {
        const {name} = req.body;

        const avatar = {
            url: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        }

        const body = {
            name,
            avatar,
        }

        const user = await User.findByIdAndUpdate(req.user.id, body, {new: true});

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating profile",
            error: error.message
        });
    }
}

// -- Admin
exports.getAllUser = async(req, res) => {
    try {
        const allUsers = await User.find({});
        
        return res.status(200).json({
            success: true,
            allUsers
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching all user details",
            error: error.message
        });
    }
}

// -- Admin
exports.getSingleUser = async(req, res) => {
    try {
        const userDetails = await User.findById(req.params.id);

        if(!userDetails) {
            return res.status(400).json({
                success: false,
                message: "No such user exists"
            });
        }
        
        return res.status(200).json({
            success: true,
            userDetails
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching user details",
            error: error.message
        });
    }
}

// -- updateRole --admin
exports.updateUserRole = async(req, res) => {
    try {
        const{role} = req.body;

        if(!role) {
            return res.status(400).json({
                success: false,
                message: "Provide Role"
            });
        }

        if(role === "Admin" || role === "User") {
            const newUserData = {
                role: req.body.role,
            };

            await User.findByIdAndUpdate(req.params.id, newUserData, {new: true});

            return res.status(200).json({
                success: true,
                message: "Role updated successfully"
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Provide Role User/Admin"
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating user role",
            error: error.message
        });
    }
}

// --deleteUser --admin
exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "No such user exists"
            });
        }
        
        //There will something going to be add for cloudinary 
        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message: "user deleted successfully"
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting user",
            error: error.message
        });
    }
}