// invoice id
// invoice has array of items/products
// purchased item table
// date is just string
// total
// tax
// quantity-number of types of products

module.exports = (sequelize, Sequelize) => {
    var Invoice = sequelize.define('invoice', {
        user_id: {
          type: Sequelize.INTEGER
        },
        total: {
          type: Sequelize.FLOAT
        },
        tax: {
          type: Sequelize.FLOAT
        },
        display: {
          type: Sequelize.BOOLEAN
        },
        isReturnable: {
          type: Sequelize.BOOLEAN
        }
      });
    return Invoice;
}