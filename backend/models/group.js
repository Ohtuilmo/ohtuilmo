'use strict'
module.exports = (sequelize, Sequelize) => {
  const Group = sequelize.define('group', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: Sequelize.STRING,
    isShortProject: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    underscored: true
  })

  return Group
}
