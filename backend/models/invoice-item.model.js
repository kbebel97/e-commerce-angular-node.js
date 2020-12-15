// Join table between Invoice and Products
// Represents the group of Products in a single Invoice

module.exports = (sequelize, Sequelize) => {
    var InvoiceItem = sequelize.define('invoice_item', {
        invoice_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        product_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        purchaseQuantity: {
          type: Sequelize.INTEGER
        },
        returnQuantity: {
          type: Sequelize.INTEGER
        },
        total: {
          type: Sequelize.INTEGER
        },
        display: {
          type: Sequelize.BOOLEAN
        },
        isReturned: {
          type: Sequelize.BOOLEAN
        }
      });
    return InvoiceItem;
}