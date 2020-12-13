// Join table between Cart and Products
// Represents the group of Products in a single Cart

module.exports = (sequelize, Sequelize) => {
    var CartItem = sequelize.define('cart_item', {
        cart_id: {
          type: Sequelize.INTEGER
        },
        product_id: {
          type: Sequelize.INTEGER
        },
        quantity: {
          type: Sequelize.INTEGER
        },
        total: {
          type: Sequelize.INTEGER
        },
        display: {
          type: Sequelize.BOOLEAN
        }
      });
    return CartItem;
}