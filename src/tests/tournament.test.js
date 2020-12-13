const request = require("supertest");
const app = require("../../app");

describe("GET /torneios ", () => {
  test("Deveria retornar um array vazio", async () => {
    const expected = [];
    const response = await request(app).get(
      "/api/torneios?category=22&modality=Individual&award=200"
    );
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });
  test("Deveria retornar um array dos torneios de futebol, com premiação de mais de 200 reais e em equipe", async () => {
    const expected = [
      {
        CATEGORIA: "Futebol",
        CODIGO: 61,
        REGRAS: "Proibido quem é o do miguel badra",
        PREMIACAO: 200,
        NOME: "Copa suzano 2020",
        DESCRICAO: "Torneio de futebol de suzano",
        DATA: "2020-12-31T03:00:00.000Z",
        CATEGORIA_CODIGO: 22,
        ORGANIZADOR_CODIGO: 1,
      },
      {
        CATEGORIA: "Futebol",
        CODIGO: 63,
        REGRAS: "tem q ser de itaqua",
        PREMIACAO: 10000,
        NOME: "copa do mundo de itaqua",
        DESCRICAO: "itaqua é o rala",
        DATA: "2020-12-31T03:00:00.000Z",
        CATEGORIA_CODIGO: 22,
        ORGANIZADOR_CODIGO: 1,
      },
    ];
    const response = await request(app).get(
      "/api/torneios?category=22&modality=Equipe&award=200"
    );
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });
  test("Deveria retornar um array com os torneios de futebol, com premiação de mais de 1000 reais e em equipe", async () => {
    const expected = [
      {
        CATEGORIA: "Futebol",
        CODIGO: 63,
        REGRAS: "tem q ser de itaqua",
        PREMIACAO: 10000,
        NOME: "copa do mundo de itaqua",
        DESCRICAO: "itaqua é o rala",
        DATA: "2020-12-31T03:00:00.000Z",
        CATEGORIA_CODIGO: 22,
        ORGANIZADOR_CODIGO: 1,
      },
    ];

    const response = await request(app).get(
      "/api/torneios?category=22&modality=Equipe&award=1000"
    );
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });
  test("Deveria retornar os torneios de xadrez", async () => {
    const expected = [
      {
        CATEGORIA: "Xadrez",
        CODIGO: 65,
        PREMIACAO: 10000,
        NOME: "torneio de candidatos",
        DESCRICAO: "Xadrez de alto nivel",
        DATA: "2020-12-31T03:00:00.000Z",
        CATEGORIA_CODIGO: 1,
        ORGANIZADOR_CODIGO: 1,
        REGRAS: "mais de 2500 de rating",
      },
    ];

    const response = await request(app).get("/api/torneios?category=1");
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });
  test("Deveria retornar os torneios individuais", async () => {
    const expected = [
      {
        CATEGORIA: "Xadrez",
        CODIGO: 65,
        PREMIACAO: 10000,
        DATA: "2020-12-31T03:00:00.000Z",
        DESCRICAO: "Xadrez de alto nivel",
        NOME: "torneio de candidatos",
        CATEGORIA_CODIGO: 1,
        ORGANIZADOR_CODIGO: 1,
        REGRAS: "mais de 2500 de rating",
      },
    ];

    const response = await request(app).get(
      "/api/torneios?modality=Individual"
    );
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });
  test("Deveria retornar os torneios com premiação maior ou igual 1000 reais", async () => {
    const expected = [
      {
        CATEGORIA: "Futebol",
        CODIGO: 63,
        REGRAS: "tem q ser de itaqua",
        PREMIACAO: 10000,
        NOME: "copa do mundo de itaqua",
        DESCRICAO: "itaqua é o rala",
        DATA: "2020-12-31T03:00:00.000Z",
        CATEGORIA_CODIGO: 22,
        ORGANIZADOR_CODIGO: 1,
      },
      {
        CATEGORIA: "Xadrez",
        CODIGO: 65,
        PREMIACAO: 10000,
        NOME: "torneio de candidatos",
        DESCRICAO: "Xadrez de alto nivel",
        DATA: "2020-12-31T03:00:00.000Z",
        CATEGORIA_CODIGO: 1,
        ORGANIZADOR_CODIGO: 1,
        REGRAS: "mais de 2500 de rating",
      },
    ];

    const response = await request(app).get("/api/torneios?award=1000");
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /api/torneio ", () => {
  test("Deveria retornar uma mensagem de sucesso", async () => {
    const response = await request(app).post("/api/torneio").send({
      name: "Copa suzano 2020",
      description: "Torneio de futebol de suzano",
      award: 200.0,
      rules: "Proibido quem é o do miguel badra",
      category: "Futebol",
      date: "2020-12-31",
    });
    expect(response.text).toBe("Torneio criado com sucesso");
    expect(response.statusCode).toBe(201);
  });
  test("Deveria retornar uma mensagem de data inválida", async () => {
    const response = await request(app).post("/api/torneio").send({
      name: "Copa suzano 2020",
      description: "Torneio de futebol de suzano",
      award: 200.0,
      rules: "Proibido quem é o do miguel badra",
      category: "Futebol",
      date: "2020-09-31",
    });
    expect(response.body).toEqual({ erro: "Data inválida" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar uma mensagem de erro de entradas", async () => {
    const response = await request(app).post("/api/torneio").send({
      description: "Torneio de futebol de itaqua",
      award: 0,
      rules: "Só os de itaqua",
      category: "Futebol",
      date: "2020-11-25",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar uma mensagem de erro de entradas", async () => {
    const response = await request(app).post("/api/torneio").send({
      name: "Copa suzano 2020",
      award: 0,
      rules: "Só os de itaqua",
      category: "Futebol",
      date: "2020-11-25",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar uma mensagem de erro de entradas", async () => {
    const response = await request(app).post("/api/torneio").send({
      name: "Copa suzano 2020",
      description: "Torneio de futebol de suzano",
      rules: "Proibido quem é o do miguel badra",
      category: "Futebol",
      date: "2020-12-31",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar uma mensagem de erro de entradas", async () => {
    const response = await request(app).post("/api/torneio").send({
      name: "Copa suzano 2020",
      description: "Torneio de futebol de suzano",
      award: 200.0,
      category: "Futebol",
      date: "2020-12-31",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar uma mensagem de erro de entradas", async () => {
    const response = await request(app).post("/api/torneio").send({
      name: "Copa suzano 2020",
      description: "Torneio de futebol de suzano",
      award: 200.0,
      rules: "Proibido quem é o do miguel badra",
      date: "2020-12-31",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar uma mensagem de erro de entradas", async () => {
    const response = await request(app).post("/api/torneio").send({
      name: "Copa suzano 2020",
      description: "Torneio de futebol de suzano",
      award: 200.0,
      rules: "Proibido quem é o do miguel badra",
      category: "Futebol",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
});

describe("POST /inscrever", () => {
  test("Deveria retornar mensagem de sucesso", async () => {
    const response = await request(app).post("/api/inscrever").send({
      tournament: 61,
      player: 2,
      team: 1,
    });
    expect(response.text).toBe("Inscrição feita com sucesso");
    expect(response.statusCode).toBe(201);
  });
  test("Deveria retornar mensagem de erro de categoria", async () => {
    const expected = {
      erro: "Jogador deve permanecer à categoria do campeonato",
    };
    const response = await request(app).post("/api/inscrever").send({
      tournament: 61,
      player: 1,
      team: 1,
    });
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar mensagem de torneio inexistente", async () => {
    const expected = {
      erro: "Torneio inexistente",
    };
    const response = await request(app).post("/api/inscrever").send({
      tournament: 100,
      player: 2,
      team: 1,
    });
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(404);
  });
  test("Deveria retornar mensagem de erro de entradas", async () => {
    const expected = {
      erro: "Entradas inválidas",
    };
    const response = await request(app).post("/api/inscrever").send({
      player: 2,
      team: 1,
    });
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar mensagem de sucesso", async () => {
    const response = await request(app).post("/api/inscrever").send({
      tournament: 61,
      team: 1,
    });
    expect(response.text).toBe("Inscrição feita com sucesso");
    expect(response.statusCode).toBe(201);
  });
  test("Deveria retornar mensagem de erro de categoria", async () => {
    const expected = {
      erro: "Equipe deve permanecer à categoria do campeonato",
    };
    const response = await request(app).post("/api/inscrever").send({
      tournament: 61,
      team: 2,
    });
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar mensagem de erro de entrada inválida", async () => {
    const expected = {
      erro: "Entradas inválidas",
    };
    const response = await request(app).post("/api/inscrever").send({
      tournament: 61,
    });
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar mensagem de erro de entrada inválida", async () => {
    const expected = {
      erro: "Entradas inválidas",
    };
    const response = await request(app).post("/api/inscrever").send({});
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(400);
  });
});
