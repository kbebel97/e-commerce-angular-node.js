module.exports = function(app) {
    const User = require('../controllers/user.controller.js');

    var router = require('express').Router();

    // Create a new Product
    router.post("/", User.create);

    // Retrieve all Products
    router.get("/", User.findAll);

    // Retrieve a single Product with id
    router.get("/:id", User.findOne);

    // Update a Product with id
    router.put("/:id", User.update);

    // Delete a Product with id
    router.delete("/:id", User.delete);

    app.use('/api/users', router);
};