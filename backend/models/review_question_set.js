module.exports = (sequelize, Sequelize) => {
  const Review_question_set = sequelize.define(
    'review_question_set',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      questions: {
        type: Sequelize.JSONB,
      },
    },
    {
      underscored: true,
    }
  )

  Review_question_set.associate = (models) => {
    Review_question_set.hasMany(models.Configuration, {
      foreignKey: 'review_question_set1Id',
    })
    Review_question_set.hasMany(models.Configuration, {
      foreignKey: 'review_question_set2Id',
    })
  }

  return Review_question_set
}
