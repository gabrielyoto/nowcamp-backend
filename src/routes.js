const express = require("express")

const { createTeam } = require("./controllers/Teams")
const { listTournaments, createTournament, subscribeToTournament } = require("./controllers/Tournament")

const routes = express.Router()

routes.post("/equipe", createTeam)
routes.get("/torneios", listTournaments)
routes.post("/torneio", createTournament)
routes.post("/inscrever", subscribeToTournament)

module.exports = routes
