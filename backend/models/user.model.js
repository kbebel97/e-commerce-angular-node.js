module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define('user', {
        email: {
          type: Sequelize.STRING,
          primaryKey: true
        },
        password: {
          type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
        }
      });
    return User;
}