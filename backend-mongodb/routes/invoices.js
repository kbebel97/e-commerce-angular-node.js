const express = require("express");

const Invoice = require("../models/invoice");

const router = express.Router();

router.use('', (req, res, next) => {
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

router.post("", (req, res, next) => {
  let fetchedInvoice;
  const invoice = new Invoice({
    date: req.body.date,
    total: req.body.total,
    tax: req.body.tax,
    shipping: req.body.shipping,
    quantity: req.body.quantity,
    isReturned: req.body.isReturned,
    purchasedItems: req.body.purchasedItems
  });
  let query = invoice.save(invoice);
  query.then(result => {
    fetchedInvoice = result;
    return Invoice.count();
      })
      .then((count) => {
        res.status(200).json({message: "Update successful!", invoice : fetchedInvoice, count : count});

      });
    }
  );

module.exports = router;
