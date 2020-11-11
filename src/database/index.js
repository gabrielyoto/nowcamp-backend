const oracledb = require("oracledb")

const connectionLink = require("../configs/database")
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

let connection

module.exports = {
  run() {
    try {
      oracledb.getConnection(connectionLink, (error, newConnection) => {
        if (error) 
          console.error(error)
        else {
          console.log('Conectado ao banco de dados')
          connection = newConnection
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      const close = async () => {
        if (connection) {
          try {
            await connection.close()
            console.log("Desconectado do banco de dados")
          } catch (error) {
            console.error(error)
          }
        }
      }
      close()
    }
  },

  getConnection() {
    return connection
  }
}
