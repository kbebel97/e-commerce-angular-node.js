module.exports = function(app) {
    const Profile = require('../controllers/profile.controller.js');

    var router = require('express').Router();

    // Create a new Profile
    router.post("/", Profile.create);

    // Retrieve all Profiles
    router.get("/", Profile.findAll);

    // Retrieve a single Profile with id
    router.get("/:id", Profile.findOne);

    // Update a Profile with id
    router.put("/:id", Profile.update);

    // Delete a Profile with id
    router.delete("/:id", Profile.delete);

    app.use('/api/profiles', router);
};