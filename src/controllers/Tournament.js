// Tabela Torneio
// CODIGO             NOT NULL NUMBER(38)
// REGRAS             NOT NULL VARCHAR2(300)
// PREMIACAO          NOT NULL NUMBER
// NOME               NOT NULL VARCHAR2(100)
// DESCRICAO          NOT NULL VARCHAR2(300)
// DATA               NOT NULL DATE
// CATEGORIA_CODIGO   NOT NULL NUMBER(38)
// ORGANIZADOR_CODIGO NOT NULL NUMBER(38)

const { getConnection } = require("../database");
const { format } = require("../utils");

module.exports = {
  async getTournaments({ query }, res) {
    // Descrição:
    // Pesquisa de Torneios: Pesquisar os torneios disponíveis com base nos filtros selecionados
    // Entradas:
    // - Categoria: Categoria selecionada como filtro para pesquisa
    // - Premiação: Se a pesquisa retornará torneios que oferecem premiação ou não
    // - Equipes: Se a pesquisa retornará torneios para equipes ou para participantes (solo)
    // Saídas:
    // - Lista de Torneios com base nos filtros usados para a pesquisa

    const connection = getConnection();
    if (!connection) return;
    try {
      const { category, award, modality } = query;

      let where = [],
        bind = [];
      if (award) {
        where.push("PREMIACAO >= :award");
        bind.push(Number(award));
      }
      if (category) {
        where.push("CATEGORIA.CODIGO = :category");
        bind.push(category);
      }
      if (modality) {
        where.push("categoria.MODALIDADE = :modality");
        bind.push(modality);
      }
      const result = await connection.execute(
        `
        SELECT categoria.nome as categoria, torneio.* FROM torneio INNER JOIN
        categoria ON categoria.codigo = torneio.categoria_codigo 
        ${where.length > 0 ? " WHERE " + where.join(" AND ") : ""}
      `,
        bind
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ erro: "Erro ao listar torneios" });
    }
  },

  async createTournament({ body }, res) {
    // Descrição:
    // Criação/Atualização de Torneios: Permite ao usuário criar um torneio com as especificações desejadas (se já tiver um torneio criado o usuário pode atualizar  as informações do mesmo)

    // Entradas:
    // - Nome do Torneio: Nome da competição
    // - Descrição: Formato do torneio e outras informações relevantes
    // - Premiação: Se o torneio oferece ou não premiação
    // - Regras: Regras da disputa do torneio
    // - Promo: Imagem Promocional do torneio para ser mostrada na página.
    // - Categoria: Esporte

    // Saídas:
    // - Dados do torneio, Mensagem de confirmação de criação de torneio

    const connection = getConnection();
    if (!connection) return;
    try {
      const { name, description, award, rules, category, date } = body;
      if (
        !name ||
        !description ||
        award === undefined ||
        !rules ||
        !category ||
        !date
      )
        return res.status(400).json({ erro: "Entradas inválidas" });
      if (new Date(date) < new Date())
        return res.status(400).json({ erro: "Data inválida" });
      const result = await connection.execute(
        `SELECT codigo FROM categoria WHERE nome = :category`,
        [category]
      );
      const categoryCode = result.rows[0].CODIGO;
      await connection.execute(
        `
        INSERT INTO torneio VALUES (
          null, :rules, :award, :name, :description, to_date(:startDate, 'yyyy-mm-dd'), :categoryCode, 1
        )
      `,
        [rules, Number(award), name, description, date, categoryCode],
        { autoCommit: true }
      );
      return res.status(201).send("Torneio criado com sucesso");
    } catch (error) {
      console.error(error);
      return res.status(400).json({ erro: "Erro ao criar torneio" });
    }
  },

  async subscribeToTournament({ body }, res) {
    // Descrição:
    // Participar/Inscrever em Torneio: Realiza a inscrição do usuário/equipe em um torneio
    // Entradas:
    // - Nome da Equipe/Usuario: Nome da organização/usuário que está se inscrevendo na competição
    // - Forma de pagamento

    // Saídas:
    // - Boleto: Boleto gerado para pagamento das taxas de inscrição
    // - Confirmação: Mensagem de confirmação de inscrição (ou email)

    // Tabela Inscricao_equipe
    // CODIGO         NOT NULL NUMBER(38)
    // DATA           NOT NULL DATE
    // EQUIPE_CODIGO  NOT NULL NUMBER(38)
    // TORNEIO_CODIGO NOT NULL NUMBER(38)

    // Tabela Inscricao_jogador
    // CODIGO         NOT NULL NUMBER(38)
    // DATA           NOT NULL DATE
    // JOGADOR_CODIGO NOT NULL NUMBER(38)
    // TORNEIO_CODIGO NOT NULL NUMBER(38)

    const connection = getConnection();
    if (!connection) return;
    try {
      const { tournament } = body;
      const d = format(new Date());
      const datestring =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      if (!tournament)
        return res.status(400).json({ erro: "Entradas inválidas" });
      if (body.player) {
        const result = await connection.execute(
          `
          SELECT categoria_codigo FROM jogador WHERE usuario_codigo = :playerCode
        `,
          [body.player]
        );
        const playerCategoryCode = result.rows[0].CATEGORIA_CODIGO;
        const result2 = await connection.execute(
          `
          SELECT categoria_codigo FROM torneio WHERE codigo = :tournamentCode
        `,
          [tournament]
        );
        if (result2.rows.length < 1)
          return res.status(404).json({ erro: "Torneio inexistente" });
        const tournamentCategoryCode = result2.rows[0].CATEGORIA_CODIGO;
        if (playerCategoryCode !== tournamentCategoryCode)
          return res.status(400).json({
            erro: "Jogador deve permanecer à categoria do campeonato",
          });
        await connection.execute(
          `
          INSERT INTO inscricao_jogador VALUES (
            null, to_date(:subscriptionDate, 'yyyy-mm-dd'), :playerCode, :tournamentCode
          )
        `,
          [datestring, body.player, tournament],
          { autoCommit: true }
        );
      } else if (body.team) {
        const result = await connection.execute(
          `
          SELECT categoria_codigo FROM equipe WHERE codigo = :teamCode
        `,
          [body.team]
        );
        const teamCategoryCode = result.rows[0].CATEGORIA_CODIGO;
        const result2 = await connection.execute(
          `
          SELECT categoria_codigo FROM torneio WHERE codigo = :tournamentCode
        `,
          [tournament]
        );
        if (result2.rows.length < 1)
          return res.status(404).json({ erro: "Torneio inexistente" });
        const tournamentCategoryCode = result2.rows[0].CATEGORIA_CODIGO;
        if (teamCategoryCode !== tournamentCategoryCode)
          return res
            .status(400)
            .json({ erro: "Equipe deve permanecer à categoria do campeonato" });
        await connection.execute(
          `
          INSERT INTO inscricao_equipe VALUES (
            null, to_date(:subscriptionDate, 'yyyy-mm-dd'), :teamCode, :tournamentCode
          )
        `,
          [date, body.team, tournament],
          { autoCommit: true }
        );
      } else return res.status(400).json({ erro: "Entradas inválidas" });
      return res.status(201).send("Inscrição feita com sucesso");
    } catch (error) {
      console.error(error);
      return res.status(400).json({ erro: "Erro ao se inscrever" });
    }
  },
};
