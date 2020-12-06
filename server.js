const app = require("./app");

const { format } = require("./src/utils");

app.listen(3030, () =>
  console.log("Servidor ligado", format(new Date(), true))
);
