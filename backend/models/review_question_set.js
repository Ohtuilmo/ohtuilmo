module.exports = (sequelize, Sequelize) => {
  const Review_question_set = sequelize.define('review_question_set', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    questions: {
      type: Sequelize.JSONB
    }
  },
  {
    underscored: true
  })

  return Review_question_set
}
