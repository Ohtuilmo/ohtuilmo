module.exports = (sequelize, Sequelize) => {
  const Registration_question_set = sequelize.define('registration_question_set', {
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

  return Registration_question_set
}
