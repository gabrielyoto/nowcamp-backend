const request = require("supertest");
const app = require("../../app");

describe("POST /equipe", () => {
  test("Deveria retornar mensagem de sucesso", async () => {
    const response = await request(app).post("/api/equipe").send({
      teamName: "Barcelona FC",
      category: 22,
    });
    expect(response.text).toBe("Equipe criada com sucesso");
    expect(response.statusCode).toBe(201);
  });
  test("Deveria retornar erro de entradas", async () => {
    const response = await request(app).post("/api/equipe").send({
      teamName: "Barcelona FC",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar erro de entradas", async () => {
    const response = await request(app).post("/api/equipe").send({
      category: 22,
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
});
