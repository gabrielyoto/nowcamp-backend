const request = require("supertest");
const app = require("../../app");

describe("POST /login", () => {
  test("Deveria retornar o código do usuário", async () => {
    const response = await request(app).post("/api/login").send({
      email: "teste@teste.com",
      password: "1234",
    });
    expect(response.text).toBe("2");
    expect(response.statusCode).toBe(200);
  });
  test("Deveria retornar erro de credenciais", async () => {
    const response = await request(app).post("/api/login").send({
      email: "teste@teste.com",
      password: "12345",
    });
    expect(response.body).toEqual({ erro: "Email/Senha Inválida" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar erro de credenciais", async () => {
    const response = await request(app).post("/api/login").send({
      email: "a@a.com",
      password: "1234",
    });
    expect(response.body).toEqual({ erro: "Email/Senha Inválida" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar erro de entradas", async () => {
    const response = await request(app).post("/api/login").send({
      email: "teste@teste.com",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
  test("Deveria retornar erro de entradas", async () => {
    const response = await request(app).post("/api/login").send({
      password: "1234",
    });
    expect(response.body).toEqual({ erro: "Entradas inválidas" });
    expect(response.statusCode).toBe(400);
  });
});
