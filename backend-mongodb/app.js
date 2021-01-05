const express = require('express');

const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const itemsRoutes = require("./routes/items");
const cartItemRoutes = require("./routes/cartItems");
const userRoutes = require("./routes/user");
const invoiceRoutes = require("./routes/invoices");


mongoose.connect("mongodb+srv://Kacper:F3RnoSvralxtB4Ba@cluster0.modg4.mongodb.net/e-commerce")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use('/api/items', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.use("/api/items", itemsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cartitems", cartItemRoutes);
app.use("/api/invoices", invoiceRoutes);




module.exports = app;
