module.exports = function(app) {
    const Address = require('../controllers/address.controller.js');

    var router = require('express').Router();

    // Create a new Address
    router.post("/", Address.create);

    // Retrieve all Addresses
    router.get("/", Address.findAll);

    // Retrieve a single Address with id
    router.get("/:id", Address.findOne);

    // Update a Address with id
    router.put("/:id", Address.update);

    // Delete a Address with id
    router.delete("/:id", Address.delete);

    app.use('/api/addresses', router);
};