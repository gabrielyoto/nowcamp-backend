const request = require("supertest");
const app = require("../../app");

describe("GET /categorias", () => {
  test("Deveria retornar as categorias", async () => {
    const expected = [
      {
        CODIGO: 1,
        NOME: "Xadrez",
        MODALIDADE: "Individual",
      },
      {
        CODIGO: 22,
        NOME: "Futebol",
        MODALIDADE: "Equipe",
      },
      {
        CODIGO: 41,
        NOME: "Volei",
        MODALIDADE: "Equipe",
      },
    ];
    const response = await request(app).get("/api/categorias");
    expect(response.body).toEqual(expected);
    expect(response.statusCode).toBe(200);
  });
});
