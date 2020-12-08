module.exports = (sequelize, Sequelize) => {
    var Address = sequelize.define('address', {
        user_id: {
          type: Sequelize.INTEGER
        },
        street: {
          type: Sequelize.STRING
        },
        city: {
          type: Sequelize.STRING
        },
        state: {
          type: Sequelize.STRING
        },
        zipCode: {
            type: Sequelize.STRING
        }
      });
    return Address;
}