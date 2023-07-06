const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connection with DB successfully"))
    .catch((e) => {
        console.log("DB connection issue");
        console.log(e);
        process.exit(1);
    })
}