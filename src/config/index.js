require('dotenv').config();

const config = {
  host: process.env.HOST,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  postgres: process.env.DATABASE_URL,
  db: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DATABASE,
    port: process.env.POSTGRES_PORT,
  },
  jwt: {
    secret_key: process.env.JWT_SECRET,
    expiresIn: '1h'
  }
};

module.exports = config;
