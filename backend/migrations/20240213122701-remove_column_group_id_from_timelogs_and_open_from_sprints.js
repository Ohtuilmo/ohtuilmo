'use strict'


module.exports = {
  up: async (query) => {
    await query.removeColumn('time_logs', 'group_id', {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
    await query.removeColumn('sprints', 'open')
  },


  down: async (query, Sequelize) => {
    await query.addColumn('time_logs', 'group_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    })
    await query.addColumn('sprints', 'open', {
      type:Sequelize.BOOLEAN,
      defaultValue: false
    })
  }
}