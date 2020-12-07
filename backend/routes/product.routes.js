module.exports = function(app) {
    const Product = require('../controllers/product.controller.js');

    var router = require('express').Router();

    // Create a new Test
    router.post("/", Product.create);

    // Retrieve all Tests
    router.get("/", Product.findAll);

    // Retrieve a single Product with id
    router.get("/:id", Product.findOne);

    // Update a Product with id
    router.put("/:id", Product.update);

    // Delete a Product with id
    router.delete("/:id", Product.delete);

    app.use('/api/products', router);
};