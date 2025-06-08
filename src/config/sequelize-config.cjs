require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@postgres:5432/claude_template_dev',
    dialect: 'postgres',
    logging: process.env.DATABASE_LOGGING === 'true' ? console.log : false,
  },
  test: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@postgres-test:5432/claude_template_test',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};