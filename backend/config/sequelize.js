require('dotenv').config()

module.exports = {
  development: {
    username: 'postgres',
    database: 'dev_postgres',
    port: '5432',
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: 0,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 300000000,
    },
  },
  staging: {
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 300000000,
    },
    ssl: true,
    dialectOptions: {
      ssl: true,
    },
  },
}
