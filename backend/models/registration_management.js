module.exports = (sequelize, Sequelize) => {
  const Registration_management = sequelize.define('registration_management', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_registration_open: {
      type: Sequelize.BOOLEAN
    },
    peer_review_open: {
      type: Sequelize.BOOLEAN
    },
    peer_review_round: {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        max: 2
      }
    },
    project_registration_message: {
      type: Sequelize.STRING
    },
    project_registration_info: {
      type: Sequelize.STRING
    },
    topic_registration_open: {
      type: Sequelize.BOOLEAN
    },
    topic_registration_message: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true
  })

  return Registration_management
}
