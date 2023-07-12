const express = require("express");
const dbConnect = require("./config/database");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors ({
        origin: 'https://ecommerce-website-steel-eight.vercel.app',
        // origin: 'http://localhost:3000',
        credentials: true
    })
);
app.use(
    fileUpload ({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

dbConnect.connect();
cloudinaryConnect();

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoutes");
const payment = require("./routes/payment");
const contact = require("./routes/contactRoute");
 
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", contact);

//Activation
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
}); 

app.get("/", (req, res) => {
    res.send(`<h1>The server is running at port no: ${PORT} </h1>`)
});