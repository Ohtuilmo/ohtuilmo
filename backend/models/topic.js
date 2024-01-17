module.exports = (sequelize, Sequelize) => {
  const Topic = sequelize.define('topic', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    content: {
      type: Sequelize.JSONB
    },
    acronym: {
      type: Sequelize.STRING
    },
    secret_id: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true
  })

  return Topic
}
