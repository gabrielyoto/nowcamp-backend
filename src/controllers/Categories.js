const { getConnection } = require("../database");

module.exports = {
  async getCategories(_req, res) {
    const connection = getConnection();
    if (!connection) return;
    try {
      const categories = await connection.execute(`SELECT * FROM categoria`);

      return res.status(200).json(categories.rows);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ erro: "Erro ao retornar categorias" });
    }
  },
};
