module.exports = (sequelize, Sequelize) => {
    var Product = sequelize.define('product', {
        name: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        price: {
            type: Sequelize.FLOAT
        },
        stock: {
            type: Sequelize.INTEGER
        },
        imagePath: {
            type: Sequelize.STRING
        }
      });
    return Product;
}

// needs link to review table