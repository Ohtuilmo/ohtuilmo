'use strict'

const up = async (query, Sequelize) => {

  await query.createTable('sprints', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    end_date: {
      type:Sequelize.DATE,
      allowNull: true
    },
    sprint_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    open: {
      type:Sequelize.BOOLEAN,
      defaultValue: false
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    created_at: {
      type:Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type:Sequelize.DATE,
      allowNull: false
    }
  })

  await query.createTable('time_logs', {
    id: {
      type:Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    work_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    time: {
      type:Sequelize.INTEGER,
      allowNull: false
    },
    student_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'student_number'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    sprint_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'sprints',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    //group_id may not be absolutely necessary: sprint is already linked to
    //group, so having direct group reference here is bit redundant
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    created_at: {
      type:Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type:Sequelize.DATE,
      allowNull: false
    }
  })



  await query.createTable('tags', {
    id: {
      type:Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type:Sequelize.STRING,
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
  })

  await query.createTable('time_log_tags', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    time_log_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'time_logs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    tag_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false

    }
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('time_log')
  await queryInterface.dropTable('sprints')
  await queryInterface.dropTable('tag')
}

module.exports = {
  up,
  down
}
