require("dotenv").config();

const express = require("express");
const app = express();
const fs = require('fs');


const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const { values } = require("lodash");
const { connect } = require("./routes/auth");

//Db connection
const mysqlConnection = require("./dbconnection")

//Middlewares
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

const port = process.env.SERVERPORT
app.listen(port, () => {
    console.log(`app is running at ${port}`);
})

