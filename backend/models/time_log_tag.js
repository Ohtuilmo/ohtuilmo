module.exports = (sequelize, Sequelize) => {
  const TimeLogTag = sequelize.define('TimeLogTag', {
    time_log_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'TimeLog',
        key: 'id'
      }
    },
    tag_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Tag',
        key: 'id'
      }
    }
  }, {
    underscored: true,
    tableName: 'time_log_tags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return TimeLogTag
}
