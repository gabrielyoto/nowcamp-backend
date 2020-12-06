const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const { run } = require("./src/database");
run();

const routes = require("./src/routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api", routes);

module.exports = app;
