module.exports = (sequelize, Sequelize) => {
  const Sprint = sequelize.define('sprint', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    sprint_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    open: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type:Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  {
    underscored: true
  })


  Sprint.associate = (models) => {
    Sprint.belongsTo(models.Group, {
      foreignKey: 'group_id',
      as: 'group',
    })
  }

  return Sprint
}