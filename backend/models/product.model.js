module.exports = (sequelize, Sequelize) => {
    var Product = sequelize.define('product', {
        name: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        }
      });
    return Product;
}