const { getConnection } = require("../database");

module.exports = {
  async login({ body }, res) {
    const connection = getConnection();
    if (!connection) return;
    try {
      const { email, password } = body;
      if (!email || !password)
        return res.status(400).json({ erro: "Entradas inválidas" });
      const user = await connection.execute(
        `
        SELECT * FROM usuario WHERE email = :email
      `,
        [email]
      );
      if (!user.rows[0]) {
        return res.status(400).json({ erro: "Email/Senha Inválida" });
      }
      if (user.rows[0].SENHA !== password) {
        return res.status(400).json({ erro: "Email/Senha Inválida" });
      }

      return res.status(200).json(user.rows[0].CODIGO);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ erro: "Erro ao autenticar" });
    }
  },
};
