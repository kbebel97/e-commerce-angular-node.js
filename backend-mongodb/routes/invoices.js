const express = require("express");
const Invoice = require("../models/invoice");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, (req, res, next) => {
  let fetchedInvoice;
  const invoice = new Invoice({
    date: req.body.date,
    total: req.body.total,
    tax: req.body.tax,
    shipping: req.body.shipping,
    quantity: req.body.quantity,
    isReturned: req.body.isReturned,
    purchasedItems: req.body.purchasedItems,
    creator: req.userData.userId
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

router.get("", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const invoicesQuery = Invoice.find({creator: req.userData.userId});
  let fetchedInvoices;
  if(pageSize && currentPage){
    invoicesQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    // Chaining multiple queries. 1st query counts amount of items in database, 2nd query retrieves them
  invoicesQuery
    .then(documents => {
      fetchedInvoices = documents;
      return Invoice.count({creator: req.userData.userId });
    })
    .then(count => {
      res.status(200).json({
        message: 'Invoices fetched successfully',
        invoices: fetchedInvoices,
        invoiceCount: count
      });
    })
  })

router.put("", checkAuth, (req, res, next) => {
     const invoice = new Invoice({
      _id: req.body.invoiceId,
      date: req.body.date,
      total: req.body.total,
      tax: req.body.tax,
      shipping: req.body.shipping,
      quantity: req.body.quantity,
      isReturned: req.body.isReturned,
      purchasedItems: req.body.purchasedItems,
      creator: req.userData.userId
    })
  Invoice.updateOne({ _id: req.body.invoiceId, creator: req.userData.userId }, invoice).then(result => {
    console.log(result);
      res.status(200).json({message: "Update successful!"});
    });
  });

module.exports = router;
