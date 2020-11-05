const { db_username, db_password } = require('./index')

module.exports = {
  user: db_username,
  password: db_password,
  connectString: "localhost:1521/xe",
}
