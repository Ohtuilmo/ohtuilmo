module.exports = (sequelize, Sequelize) => {
  const TimeLog = sequelize.define('time_log', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    work_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    time: {
      type:Sequelize.INTEGER,
      allowNull: false
    },
    created_at: {
      type:Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type:Sequelize.DATE,
      allowNull: false
    }
  },
  {
    underscored: true
  })

  return TimeLog
}