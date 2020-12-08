module.exports = function(app) {
    const Profile = require('../controllers/profile.controller.js');

    var router = require('express').Router();

    // Create a new Product
    router.post("/", Profile.create);

    // Retrieve all Products
    router.get("/", Profile.findAll);

    // Retrieve a single Product with id
    router.get("/:id", Profile.findOne);

    // Update a Product with id
    router.put("/:id", Profile.update);

    // Delete a Product with id
    router.delete("/:id", Profile.delete);

    app.use('/api/profiles', router);
};