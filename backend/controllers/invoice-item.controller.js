const db = require('../models');
const InvoiceItem = db.invItems;
const Op = db.Sequelize.Op;

// Create and Save a new InvoiceItem
exports.create = (req, res) => {
  // Validate request
  if (!req.body.invoice_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create an InvoiceItem
  const invoiceItem = {
    invoice_id: req.body.invoice_id,
    product_id: req.body.product_id,
    purchaseQuantity: req.body.purchaseQuantity,
    returnQuantity: req.body.returnQuantity,
    total: req.body.total,
    display: req.body.display,
    isReturned: req.body.isReturned
  };

  // Save InvoiceItem in the database
  InvoiceItem.create(invoiceItem)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the InvoiceItem."
      });
    });
};

// Retrieve all InvoiceItems from the database.
exports.findAll = (req, res) => {
    InvoiceItem.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting the InvoiceItems."
      });
    });
  
};

// Find a single InvoiceItem with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    InvoiceItem.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving InvoiceItem with id=" + id
        });
      });
};

// Update a InvoiceItem by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    InvoiceItem.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "InvoiceItem was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update InvoiceItem with id=${id}. Maybe InvoiceItem was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating InvoiceItem with id=" + id
        });
      });
};

// Delete a InvoiceItem with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    InvoiceItem.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "InvoiceItem was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete InvoiceItem with id=${id}. Maybe InvoiceItem was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete InvoiceItem with id=" + id
        });
      });
};