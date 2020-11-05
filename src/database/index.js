const oracledb = require("oracledb")

const connectionLink = require("../configs/database")
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

module.exports = () => {
  async function run() {
    let connection

    try {
      connection = await oracledb.getConnection(connectionLink, error => {
        if (error) 
          console.error(err);
        else
          console.log('Conectado ao banco de dados');
      })
    } catch (error) {
      console.error(error)
    } finally {
      if (connection) {
        try {
          await connection.close()
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  run()
}
