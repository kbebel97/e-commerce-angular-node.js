module.exports = (sequelize, Sequelize) => {
    var Profile = sequelize.define('profile', {
        user_id: {
          type: Sequelize.INTEGER
        },
        firstName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING
        },
        imagePath: {
          type: Sequelize.STRING
        }
      });
    return Profile;
}