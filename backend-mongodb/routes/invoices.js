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

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const invoicesQuery = Invoice.find();
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
      return Invoice.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Invoices fetched successfully',
        invoices: fetchedInvoices,
        invoiceCount: count
      });
    })
  })

router.put("", (req, res, next) => {
     const invoice = new Invoice({
      _id: req.body.invoiceId,
      date: req.body.date,
      total: req.body.total,
      tax: req.body.tax,
      shipping: req.body.shipping,
      quantity: req.body.quantity,
      isReturned: req.body.isReturned,
      purchasedItems: req.body.purchasedItems
    })
  Invoice.updateOne({ _id: req.body.invoiceId }, invoice).then(result => {
    console.log(result);
      res.status(200).json({message: "Update successful!"});
    });
  });

module.exports = router;
