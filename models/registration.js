module.exports = (sequelize, Sequelize) => {
  const Registration = sequelize.define('registration', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    preferred_topics: {
      type: Sequelize.JSONB
    },
    questions: {
      type: Sequelize.JSONB
    },
    configuration_id: {
      type: Sequelize.INTEGER
    },
  })

  Registration.associate = (models) => {
    Registration.belongsTo(models.User, {
      as: 'student'
    })
  }

  return Registration
}
