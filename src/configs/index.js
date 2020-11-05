const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  db_username: process.env.DATABASE_USER,
  db_password: process.env.DATABASE_PASSWORD,
}
