const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        public_id: {
          type: String,
          required: true,
          default: "Sample Id"
        },
        url: {
          type: String,
          required: true,
          default: "Sample url"
        },
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "User"]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
})

module.exports = mongoose.model("User", userSchema);