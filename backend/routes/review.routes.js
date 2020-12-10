module.exports = function(app) {
    const Review = require('../controllers/review.controller.js');

    var router = require('express').Router();

    // Create a new Review
    router.post("/", Review.create);

    // Retrieve all Reviews
    router.get("/", Review.findAll);

    // Retrieve a single Review with id
    router.get("/:id", Review.findOne);

    // Update a Review with id
    router.put("/:id", Review.update);

    // Delete a Review with id
    router.delete("/:id", Review.delete);

    app.use('/api/reviews', router);
};