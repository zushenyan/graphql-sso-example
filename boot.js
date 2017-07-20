const app    = require("./app.js");
const config = require("./config/server.js");

app.listen(config.port, () => {
  console.log(`server is running on port ${config.port}...`);
});
