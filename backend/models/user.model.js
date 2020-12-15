module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define('user', {
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        role: {
            type: Sequelize.STRING
        }
      });
    return User;
}