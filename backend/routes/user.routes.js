module.exports = function(app) {
    const User = require('../controllers/user.controller.js');
    const upload = require('../images/upload.js');

    var router = require('express').Router();

    // Create a new User
    router.post("/", User.create);

    // Upload a User image
    router.post("/images", upload.single('userImage'), User.uploadImage);

    // Retrieve all Users
    router.get("/", User.findAll);

    // Retrieve a single User with id
    router.get("/:id", User.findOne);

    // Retrieve a single User by their email and password
    router.post("/login", User.findRegistered);

    // Update a User with id
    router.put("/:id", User.update);

    // Delete a User with id
    router.delete("/:id", User.delete);

    app.use('/api/users', router);
};