const db = require('../models');
const Invoice = db.invoices;
const Op = db.Sequelize.Op;

// Create and Save a new Invoice
exports.create = (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create an Invoice
  const invoice = {
    user_id: req.body.user_id,
    total: req.body.total,
    tax: req.body.tax,
    display: req.body.display,
    isReturnable: req.body.isReturnable
  };

  // Save Invoice in the database
  Invoice.create(invoice)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Invoice."
      });
    });
};

// Retrieve all Invoices from the database.
exports.findAll = (req, res) => {
  Invoice.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting the Invoices."
      });
    });
  
};

// Find a single Invoice with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Invoice.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Invoice with id=" + id
        });
      });
};

// Update a Invoice by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Invoice.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Invoice was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Invoice with id=${id}. Maybe Invoice was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Invoice with id=" + id
        });
      });
};

// Delete a Invoice with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Invoice.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Invoice was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Invoice with id=${id}. Maybe Invoice was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Invoice with id=" + id
        });
      });
};