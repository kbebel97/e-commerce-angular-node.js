const db = require('../models');
const Address = db.addresses;
const Op = db.Sequelize.Op;

// Create and Save a new Address
exports.create = (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Address
  const address = {
    user_id: req.body.user_id,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode
  };

  // Save Address in the database
  Address.create(address)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Address."
      });
    });
};

// Retrieve all Addresss from the database.
exports.findAll = (req, res) => {
    Address.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting the Addresss."
      });
    });
  
};

// Find a single Address with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Address.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Address with id=" + id
        });
      });
};

// Update a Address by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Address.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Address was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Address with id=${id}. Maybe Address was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Address with id=" + id
        });
      });
};

// Delete a Address with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Address.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Address was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Address with id=${id}. Maybe Address was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Address with id=" + id
        });
      });
};