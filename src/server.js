const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
var fileUpload = require('express-fileupload');



//routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const articleRoutes = require("./routes/article");
const settingRoutes = require("./routes/setting");
const portfolioRoutes = require("./routes/portfolio");
const freelancerRoutes = require("./routes/freelancer");

//environment variable or you can say constants
env.config();

//cloudinary config
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

// mongodb connection

mongoose
  .connect(`${process.env.MONGO_DB_URL}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connected");
  });

app.use(cors());
//app.use(fileUpload());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/freelancer", freelancerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
