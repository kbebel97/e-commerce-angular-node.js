module.exports = (sequelize, Sequelize) => {
    var Review = sequelize.define('review', {
        product_id: {
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        rating: {
          type: Sequelize.STRING
        },
        comment: {
          type: Sequelize.STRING
        }
      });
    return Review;
}