module.exports = (sequelize, Sequelize) => {
  const Review_answer = sequelize.define('review_answer', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    answers: {
      type: Sequelize.JSONB
    }
  },
  {
    underscored: true
  })

  Review_answer.associate = (models) => {
    Review_answer.belongsTo(models.User, {
      foreignKey: 'id',
    })
  }

  return Review_answer
}