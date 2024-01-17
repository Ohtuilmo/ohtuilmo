module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define('review', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER
    },
    term: {
      type: Sequelize.STRING
    },
    questions: {
      type: Sequelize.JSONB
    }
  },
  {
    underscored: true
  })

  Review.associate = (models) => {
    Review.hasMany(models.Review_answer, {
      foreignKey: 'id',
      as: 'review answers',
    })
  }

  return Review
}