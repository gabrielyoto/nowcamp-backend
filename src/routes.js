const express = require("express")

const routes = express.Router()

routes.get("/teste", (req, res) => {
  res.send("Teste")
})

module.exports = routes
