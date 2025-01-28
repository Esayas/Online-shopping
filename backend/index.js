const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const productsRoute = require("./routes/products");
const multer = require("multer");

const bodyParser = require("body-parser");

const products = require("./products");

require("dotenv").config();

const app = express();

// Increase the request size limit (adjust the limit based on your needs)
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
app.use(cors());

/*miidle ware*/
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/products", productsRoute);

app.get("/", (req, res) => {
  res.send("TG");
});

app.get("/tg", (req, res) => {
  res.send("TG");
});

app.get("/products", (req, res) => {
  res.send(products);
});

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI;

app.listen(port, console.log(`Thanks God ${port}`));

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection Successful .... TG"))
  .catch((err) => console.log("Mongo DB connection failed TG3", err.message));
