const db = require('../models');
const Profile = db.profiles;
const Op = db.Sequelize.Op;

// Create and Save a new Profile
exports.create = (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Profile
  const profile = {
    user_id: req.body.user_id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    imagePath: req.body.imagePath
  };

  // Save Profile in the database
  Profile.create(profile)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Profile."
      });
    });
};

// Upload a Profile image
exports.uploadImage = (req, res, next) => {
  try {
    return res.status(201).json({
      message: "File uploaded successfully",
      filename: req.file.filename
    });
  } catch (error) {
    console.error(error);
  }
}

// Retrieve all Profiles from the database.
exports.findAll = (req, res) => {
  Profile.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting the Profiles."
      });
    });
  
};

// Find a single Profile with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Profile.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Profile with id=" + id
        });
      });
};

// Update a Profile by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Profile.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Profile was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Profile with id=${id}. Maybe Profile was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Profile with id=" + id
        });
      });
};

// Delete a Profile with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Profile.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Profile was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Profile with id=${id}. Maybe Profile was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Profile with id=" + id
        });
      });
};