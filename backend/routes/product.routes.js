module.exports = function(app) {
    const Product = require('../controllers/product.controller.js');
    const Review = require('../controllers/review.controller.js');
    const upload = require('../images/upload.js');

    var router = require('express').Router();

    // Create a new Product
    router.post("/", Product.create);

    // Upload a Product image
    router.post("/images", upload.single('productImage'), Product.uploadImage);

    // Retrieve all Products
    router.get("/", Product.findAll);

    // Retrieve all reviews for Product with id
    router.get("/:id/reviews", Review.findByProduct);

    // Retrieve a single Product with id
    router.get("/:id", Product.findOne);

    // Update a Product with id
    router.put("/:id", Product.update);

    // Delete a Product with id
    router.delete("/:id", Product.delete);

    app.use('/api/products', router);
};