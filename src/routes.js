const express = require("express");

const { createTeam } = require("./controllers/Teams");
const { login } = require("./controllers/Login");
const { getCategories } = require("./controllers/Categories");
const {
  getTournaments,
  createTournament,
  subscribeToTournament,
} = require("./controllers/Tournament");

const routes = express.Router();

routes.post("/equipe", createTeam);
routes.get("/torneios", getTournaments);
routes.post("/torneio", createTournament);
routes.post("/inscrever", subscribeToTournament);
routes.get("/categorias", getCategories);
routes.post("/login", login);

module.exports = routes;
