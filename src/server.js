const http = require("http");
const config = require("./config");
const { handleRouter } = require("./handlers");

function createServer() {
  return http.createServer((request, response) => {
    handleRouter(request, response);
  });
}

function startServer() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Cars API listening on http://localhost:${config.port}`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createServer,
  handleRequest: handleRouter,
  startServer
};
