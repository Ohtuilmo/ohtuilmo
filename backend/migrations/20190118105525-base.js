'use strict'

/*
 * This base migration attempts to create an 1:1 schema with the schema on the
 * current production server. The schema **DOES NOT MATCH** the schema created
 * by Sequelize from the models, because it does not match production's schema!
 * The next migration fixes this.
 *
 * An oddity here is that **some** models use snake_case and some camelCase, and
 * some use the "underscore: true" option, whereas some don't.
 * As a result, **some** tables have createdAt and some created_at, etc.
 * Some foreign key associations also use underscores, whereas some use camelCase.
 *
 * Another change should address this change as a migration and model update.
 */

module.exports = {
  up: async (query, Sequelize) => {
    // first create tables, then add relations

    const createTimestampColumns = ({ camelCase }) => {
      const timestampType = {
        type: Sequelize.DATE,
        allowNull: false
      }

      const fieldNames = camelCase
        ? ['createdAt', 'updatedAt']
        : ['created_at', 'updated_at']

      /*
       * Map the fieldNames array into an array of objects
       * where the field name is the key and timetampType is the value
       * ['foo', 'bar'] --> [ {foo: timestampType, bar: timestampType} ]
       */
      return fieldNames.reduce(
        (opts, name) => ({
          ...opts,
          [name]: timestampType
        }),
        {}
      )
    }
    // since associations are created afterwards, we can do all of these
    // concurrently. query.createTable returns promises so we gather them all
    // into an array to start them all at the same time, then wait for finish
    // with Promise.all
    const tableCreationPromises = [
      query.createTable('configurations', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING,
        content: Sequelize.JSONB,
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: false }),
        // foreign keys for associations
        review_question_set1_id: Sequelize.INTEGER,
        review_question_set2_id: Sequelize.INTEGER,
        registration_question_set_id: Sequelize.INTEGER
      }),
      query.createTable('groups', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        group_name: Sequelize.STRING,
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: true })
      }),
      query.createTable('memberships', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        role: Sequelize.STRING,
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: false }),
        // foreign keys for associations
        student_number: Sequelize.STRING
      }),
      query.createTable('registration_question_sets', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING,
        questions: Sequelize.JSONB,
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: true })
      }),
      query.createTable('registrations', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        preferred_topics: Sequelize.JSONB,
        questions: Sequelize.JSONB,
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: true }),
        // foreign keys for associations
        configuration_id: Sequelize.INTEGER,
        studentStudentNumber: Sequelize.STRING(255)
      }),
      query.createTable('review_question_sets', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING,
        questions: Sequelize.JSONB,
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: true })
      }),
      query.createTable('topic_dates', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        dates: Sequelize.JSONB,
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: true })
      }),
      query.createTable('topics', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        content: Sequelize.JSONB,
        acronym: Sequelize.STRING,
        secret_id: Sequelize.STRING,
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: true })
      }),
      query.createTable('users', {
        student_number: {
          type: Sequelize.STRING,
          primaryKey: true
        },
        username: Sequelize.STRING,
        first_names: Sequelize.STRING,
        last_name: Sequelize.STRING,
        email: Sequelize.STRING,
        admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        // sequelize timestamps
        ...createTimestampColumns({ camelCase: true })
      })
    ]

    // wait for table creation
    await Promise.all(tableCreationPromises)

    // tables created, add association

    /*
     * Sequelize's model constrains, by default, add
     * - ON UPDATE CASCADE
     * - ON DELETE SET NULL
     * However, the production schema has one relation with ON DELETE CASCADE...
     */
    const defaultOnDeleteAndUpdate = {
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }

    const addForeignKey = (
      constraintName,
      targetTable,
      referencedTable,
      onDeleteAndUpdate = defaultOnDeleteAndUpdate
    ) => {
      const [table, field] = targetTable
      const [foreignTable, foreignField] = referencedTable

      return query.addConstraint(table, [field], {
        name: constraintName,
        type: 'FOREIGN KEY',
        references: {
          table: foreignTable,
          field: foreignField
        },
        onUpdate: onDeleteAndUpdate.onUpdate,
        onDelete: onDeleteAndUpdate.onDelete
      })
    }

    // Foreign key names have been plucked directly from the database schema
    // dump
    await addForeignKey(
      'configurations_registration_question_set_id_fkey',
      ['configurations', 'registration_question_set_id'],
      ['registration_question_sets', 'id']
    )
    await addForeignKey(
      'configurations_review_question_set1_id_fkey',
      ['configurations', 'review_question_set1_id'],
      ['review_question_sets', 'id']
    )
    await addForeignKey(
      'configurations_review_question_set2_id_fkey',
      ['configurations', 'review_question_set2_id'],
      ['review_question_sets', 'id']
    )
    await addForeignKey(
      'memberships_id_fkey',
      ['memberships', 'id'],
      ['groups', 'id'],
      {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Production schema's single constraint oddity.
      }
    )
    await addForeignKey(
      'registrations_configuration_id_fkey',
      ['registrations', 'configuration_id'],
      ['configurations', 'id']
    )

    // Important: migration must return promise which, when resolved, marks the
    // completion of all query operations. Here we just return the last awaited
    // promise since all the other awaits have been done before this one.
    return await addForeignKey(
      'registrations_studentStudentNumber_fkey',
      ['registrations', 'studentStudentNumber'],
      ['users', 'student_number']
    )
  },

  down: async (query) => {
    // Since this is the base migration, rolling back this migration should
    // delete all of the tables and their associations.

    // Start with associations so that we can delete tables without constraint
    // violations.

    const constraints = [
      {
        table: 'configurations',
        constraint: 'configurations_registration_question_set_id_fkey'
      },
      {
        table: 'configurations',
        constraint: 'configurations_review_question_set1_id_fkey'
      },
      {
        table: 'configurations',
        constraint: 'configurations_review_question_set2_id_fkey'
      },
      { table: 'memberships', constraint: 'memberships_id_fkey' },
      {
        table: 'registrations',
        constraint: 'registrations_configuration_id_fkey'
      },
      {
        table: 'registrations',
        constraint: 'registrations_studentStudentNumber_fkey'
      }
    ]
    const removeConstraintPromises = constraints.map(({ table, constraint }) =>
      query.removeConstraint(table, constraint)
    )
    await Promise.all(removeConstraintPromises)

    // Constraints removed, remove tables
    const tableNames = [
      'configurations',
      'groups',
      'memberships',
      'registration_question_sets',
      'registrations',
      'review_question_sets',
      'topic_dates',
      'topics',
      'users'
    ]

    return await Promise.all(
      tableNames.map((tableName) => query.dropTable(tableName))
    )
  }
}
