import http from "http";
import { fileURLToPath } from "url";
import config from "./config.js";
import { handleRouter } from "./handlers.js";

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

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  startServer();
}

export {
  createServer,
  handleRouter as handleRequest,
  startServer
};
