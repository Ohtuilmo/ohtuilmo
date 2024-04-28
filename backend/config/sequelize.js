require('dotenv').config()

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SeederMeta'
  },
  test: {
    url: process.env.DATABASE_URL,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SeederMeta'
  },
  production: {
    url: process.env.DATABASE_URL,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SeederMeta',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true
      }
    }
  }
}
