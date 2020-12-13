module.exports = function(app) {
    const InvoiceItem = require('../controllers/invoice-item.controller.js');

    var router = require('express').Router();

    // Create a new InvoiceItem
    router.post("/", InvoiceItem.create);

    // Retrieve all InvoiceItems
    router.get("/", InvoiceItem.findAll);

    // Retrieve a single InvoiceItem with id
    router.get("/:id", InvoiceItem.findOne);

    // Update a InvoiceItem with id
    router.put("/:id", InvoiceItem.update);

    // Delete a InvoiceItem with id
    router.delete("/:id", InvoiceItem.delete);

    app.use('/api/invoiceitems', router);
};