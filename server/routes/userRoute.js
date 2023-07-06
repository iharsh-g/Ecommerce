const express = require("express");
const router = express.Router();

const { signUp, login, logout, resetPasswordToken, resetPassword, 
        getUserDetails, changePassword, updateProfile, 
        getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");

const { isAdmin, isUser, auth } = require("../middlewares/auth");

router.post("/signup", signUp);
router.post("/login", login);

router.post("/password/forgot", resetPasswordToken)
router.put("/password/reset/:token", resetPassword);

router.get("/logout", logout);

router.get("/me", auth, getUserDetails);
router.put("/password/change", auth, changePassword);
router.put("/me/updateProfile", auth, updateProfile);

//Admin work
router.get("/admin/users", auth, isAdmin, getAllUser);
router.get("/admin/user/:id", auth, isAdmin, getSingleUser);
router.put("/admin/user/:id", auth, isAdmin, updateUserRole);
router.delete("/admin/user/:id", auth, isAdmin, deleteUser);



//These bellow routes is used to check whether user is logged in or admin is logged in
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success:true,
        message:"Welcome to the Protected route for Admin"
    })
});

router.get("/user", auth, isUser, (req, res) => {
    res.json({
        success:true,
        message:"Welcome to the Protected route for User"
    })
});

router.get("/authenticated", auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Token is authenticated"
    })
})

module.exports = router;