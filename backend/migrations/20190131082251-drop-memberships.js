'use strict'

// This migration drops the "memberships" and "groups" tables.
// They are not currently actually used so we don't need to back up the data.

module.exports = {
  up: async (query) => {
    // Remove associations

    await query.removeConstraint('memberships', 'memberships_group_id_fkey')
    await query.removeConstraint(
      'memberships',
      'memberships_student_number_fkey'
    )

    // Drop table
    return await query.dropTable('memberships')
  },

  down: async (query, Sequelize) => {
    // create back tables

    await query.createTable('memberships', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      role: Sequelize.STRING,
      group_id: Sequelize.INTEGER,
      // sequelize timestamps
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // foreign keys for associations
      student_number: Sequelize.STRING
    })

    // create foreign key constraints

    await query.addConstraint('memberships', ['group_id'], {
      name: 'memberships_group_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'groups',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
    return query.addConstraint('memberships', ['student_number'], {
      name: 'memberships_student_number_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'users',
        field: 'student_number'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  }
}
