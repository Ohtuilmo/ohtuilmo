'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    await query.addColumn(
      'registration_managements',
      'project_registration_conf',
      Sequelize.INTEGER
    )

    await query.addColumn(
      'registration_managements',
      'peer_review_conf',
      Sequelize.INTEGER
    )

    await query.addColumn(
      'registration_managements',
      'topic_registration_conf',
      Sequelize.INTEGER
    )

    await query.addColumn('topics', 'configuration_id', Sequelize.INTEGER)

    await query.addConstraint(
      'registration_managements',
      ['project_registration_conf'],
      {
        name: 'registration_managements_project_registration_conf_fkey',
        type: 'FOREIGN KEY',
        references: {
          table: 'configurations',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )

    await query.addConstraint(
      'registration_managements',
      ['peer_review_conf'],
      {
        name: 'registration_managements_peer_review_conf_fkey',
        type: 'FOREIGN KEY',
        references: {
          table: 'configurations',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )

    await query.addConstraint(
      'registration_managements',
      ['topic_registration_conf'],
      {
        name: 'registration_managements_topic_registration_conf_fkey',
        type: 'FOREIGN KEY',
        references: {
          table: 'configurations',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )

    await query.addConstraint('topics', ['configuration_id'], {
      name: 'topics_configuration_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'configurations',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    await query.removeColumn('configurations', 'active')
  },

  down: async (query, Sequelize) => {
    await query.addColumn('configurations', 'active', Sequelize.BOOLEAN)

    await query.removeConstraint(
      'registration_managements',
      'registration_managements_project_registration_conf_fkey'
    )

    await query.removeConstraint(
      'registration_managements',
      'registration_managements_peer_review_conf_fkey'
    )

    await query.removeConstraint(
      'registration_managements',
      'registration_managements_topic_registration_conf_fkey'
    )

    await query.removeConstraint('topics', 'topics_configuration_id_fkey')

    await query.removeColumn(
      'registration_managements',
      'project_registration_conf'
    )

    await query.removeColumn('registration_managements', 'peer_review_conf')

    await query.removeColumn(
      'registration_managements',
      'topic_registration_conf'
    )

    await query.removeColumn('topics', 'configuration_id')
  }
}
