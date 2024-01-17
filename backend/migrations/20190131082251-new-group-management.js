// @ts-check
/// <reference lib="es2017" />
'use strict'
/**
 * @typedef {import("sequelize").QueryInterface} QueryInterface
 */

// This migration drops the "memberships" and "groups" tables.
// They are not currently actually used so we don't need to back up the data.

/**
 *
 * @param {QueryInterface} query
 * @typedef {string} TableName
 * @typedef {string} ColumnName
 */
const createAddForeignKey = (query) => {
  /**
   * @param {string} constraintName
   * @param {[TableName, ColumnName]} targetTable
   * @param {[TableName, ColumnName]} referencedTable
   * @param {{onUpdate: string, onDelete: string}} onDeleteAndUpdate
   */
  const addForeignKey = (
    constraintName,
    targetTable,
    referencedTable,
    onDeleteAndUpdate
  ) => {
    const [table, field] = targetTable
    const [foreignTable, foreignField] = referencedTable

    return query.addConstraint(table, [field], {
      name: constraintName,
      type: 'foreign key',
      references: {
        table: foreignTable,
        field: foreignField
      },
      onUpdate: onDeleteAndUpdate.onUpdate,
      onDelete: onDeleteAndUpdate.onDelete
    })
  }

  return addForeignKey
}

/**
 * @param {QueryInterface} query
 */
const up = async (query, Sequelize) => {
  const createTimestampColumns = ({ camelCase }) => {
    const timestampType = {
      type: Sequelize.DATE,
      allowNull: false
    }

    return camelCase
      ? { createdAt: timestampType, updatedAt: timestampType }
      : { created_at: timestampType, updated_at: timestampType }
  }

  // Update group table
  // group feature has not been in use before this so just...drop it
  await query.dropTable('groups')
  await query.createTable('groups', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: Sequelize.STRING,
    ...createTimestampColumns({ camelCase: true }),
    topicId: Sequelize.INTEGER,
    configurationId: Sequelize.INTEGER,
    instructorId: Sequelize.STRING
  })

  // Create "group <-> user" join table
  await query.createTable('group_students', {
    ...createTimestampColumns({ camelCase: true }),
    groupId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userStudentNumber: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  // Constraints

  const addForeignKey = createAddForeignKey(query)

  // group_students uses composite primary keyi
  await query.addConstraint(
    'group_students',
    ['groupId', 'userStudentNumber'],
    {
      type: 'primary key',
      name: 'group_students_pkey'
    }
  )

  // group_student's foreign keys
  await addForeignKey(
    'group_students_groupId_fkey',
    ['group_students', 'groupId'],
    ['groups', 'id'],
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' }
  )
  await addForeignKey(
    'group_students_userStudentNumber_fkey',
    ['group_students', 'userStudentNumber'],
    ['users', 'student_number'],
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' }
  )

  // group foreign keys
  await addForeignKey(
    'groups_configurationId_fkey',
    ['groups', 'configurationId'],
    ['configurations', 'id'],
    { onUpdate: 'CASCADE', onDelete: 'SET NULL' }
  )
  await addForeignKey(
    'groups_instructorId_fkey',
    ['groups', 'instructorId'],
    ['users', 'student_number'],
    { onUpdate: 'CASCADE', onDelete: 'SET NULL' }
  )
  await addForeignKey(
    'groups_topicId_fkey',
    ['groups', 'topicId'],
    ['topics', 'id'],
    { onUpdate: 'CASCADE', onDelete: 'SET NULL' }
  )
}

/**
 * @param {QueryInterface} query
 */
const down = async (query, Sequelize) => {
  // remove created fkeys
  const constraints = [
    { table: 'groups', constraint: 'groups_topicId_fkey' },
    { table: 'groups', constraint: 'groups_instructorId_fkey' },
    { table: 'groups', constraint: 'groups_configurationId_fkey' },
    {
      table: 'group_students',
      constraint: 'group_students_userStudentNumber_fkey'
    },
    { table: 'group_students', constraint: 'group_students_groupId_fkey' }
  ]

  const removeConstraintPromises = constraints.map(({ table, constraint }) =>
    query.removeConstraint(table, constraint)
  )
  await Promise.all(removeConstraintPromises)

  // remove group_students join table
  await query.dropTable('group_students')

  // manipulate group table back
  //   add back group_name
  await query.addColumn('groups', 'group_name', Sequelize.STRING)
  //   remove added colums
  const addedColumns = ['name', 'topicId', 'configurationId', 'instructorId']
  const removeColumnPromises = addedColumns.map((column) =>
    query.removeColumn('groups', column)
  )

  return await Promise.all(removeColumnPromises)
}

module.exports = {
  up,
  down
}
