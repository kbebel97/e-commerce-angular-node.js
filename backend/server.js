const express = require('express');
const bodyParser = require("body-parser");
const port = 3080;
const cors = require('cors');
const con = require('./database/connection');

const app = express()
      .use(cors())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));

// Product CRUD

app.get('/products', (req, res) => {
  con.query("SELECT * FROM product", function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM product WHERE product_id = ?", id, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/products', (req, res) => {
    var product = {
      name        : req.body.name,
      description : req.body.description,
      price       : req.body.price,
      stock       : req.body.stock,
      image_path  : req.body.imagePath
    }
    con.query("INSERT INTO product SET ?", product, function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  });

app.put('/products/:id', (req, res) => {
  const id = req.params.id;
  var product = {
    name        : req.body.name,
    description : req.body.description,
    price       : req.body.price,
    stock       : req.body.stock,
    image_path  : req.body.imagePath
  }
  con.query("UPDATE product SET ? WHERE product_id = ?", 
        [product, id], function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});
  
app.delete('/products/:id', (req, res) => {
  const id = req.params.id;
  con.query("DELETE FROM product WHERE product_id = ?", id, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// User CRUD

app.get('/users', (req, res) => {
  con.query("SELECT * FROM user", function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  con.query("SELECT * FROM user WHERE user_id = ?", id, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/users', (req, res) => {
    var user = {
      email              : req.body.email,
      password           : req.body.password,
      first_name         : req.body.firstName,
      last_name          : req.body.lastName,
      phone_number       : req.body.phoneNumber,
      role               : req.body.role,
      billing_address_id : req.body.billingAddress
    }
    con.query("INSERT INTO user SET ?", user, function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  });

app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  var user = {
    email              : req.body.email,
    password           : req.body.password,
    first_name         : req.body.firstName,
    last_name          : req.body.lastName,
    phone_number       : req.body.phoneNumber,
    role               : req.body.role,
    billing_address_id : req.body.billingAddress
  }
  con.query("UPDATE user SET ? WHERE user_id = ?", 
        [user, id], function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});
  
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  con.query("DELETE FROM user WHERE user_id = ?", id, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});