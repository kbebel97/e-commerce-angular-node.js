// contains whatever products/items are in the shopping cart
// basically like an invoice but missing some info?
// needed even?
// Contains a group of items

module.exports = (sequelize, Sequelize) => {
    var Cart = sequelize.define('cart', {
        user_id: {
          type: Sequelize.INTEGER
        },
        total: {
          type: Sequelize.FLOAT
        },
        tax: {
          type: Sequelize.FLOAT
        }
      });
    return Cart;
}