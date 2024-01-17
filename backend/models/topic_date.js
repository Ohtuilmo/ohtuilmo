module.exports = (sequelize, Sequelize) => {
  const Topic_date = sequelize.define('topic_date', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    dates: {
      type: Sequelize.JSONB
    }
  },
  {
    underscored: true
  })

  return Topic_date
}