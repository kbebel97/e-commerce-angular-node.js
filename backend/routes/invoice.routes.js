module.exports = function(app) {
    const Invoice = require('../controllers/invoice.controller.js');

    var router = require('express').Router();

    // Create a new Invoice
    router.post("/", Invoice.create);

    // Retrieve all Invoices
    router.get("/", Invoice.findAll);

    // Retrieve a single Invoice with id
    router.get("/:id", Invoice.findOne);

    // Update a Invoice with id
    router.put("/:id", Invoice.update);

    // Delete a Invoice with id
    router.delete("/:id", Invoice.delete);

    app.use('/api/invoices', router);
};