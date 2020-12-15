module.exports = (sequelize, Sequelize) => {
    var Product = sequelize.define('product', {
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        individualPrice: {
          type: Sequelize.FLOAT,
          allowNull: false
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