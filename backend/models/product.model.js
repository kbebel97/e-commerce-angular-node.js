module.exports = (sequelize, Sequelize) => {
    var Product = sequelize.define('product', {
        name: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        individualPrice: {
            type: Sequelize.FLOAT
        },
        individualTax: {
            type: Sequelize.FLOAT
        },
        individualShipping: {
          type: Sequelize.FLOAT
        },
        manufacturer: {
          type: Sequelize.STRING
        },
        rating: {
          type: Sequelize.STRING
        },
        imagePath: {
            type: Sequelize.STRING
        }
      });
    return Product;
}

// needs link to review table