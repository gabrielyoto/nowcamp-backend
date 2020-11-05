const express = require("express")
const helmet = require("helmet")
const cors = require("cors")

const { format } = require("./src/utils")

require("./src/database")()

const routes = require("./src/routes")

const app = express()

app.use(helmet())
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())
app.use("/api", routes)

app.listen(3030, () => console.log("Servidor ligado", format(new Date, true)))
