const { getConnection } = require("../database")

module.exports = {
  async createTeam({ body }, res) {
    const connection = getConnection()
    if (!connection) return
    try {
      const { teamName, category } = body
      if (!teamName || !category) return res.status(400).json({ "erro": "Entradas inválidas" })
      await connection.execute(`
        INSERT INTO equipe VALUES (NULL, :teamName, :category)
      `, [teamName, category], { autoCommit: true })

      return res.status(201).send("Equipe criada com sucesso")
    } catch (error) {
      console.error(error)
      return res.status(400).json({ "error": "Erro ao criar equipe" })
    }
  }
}
