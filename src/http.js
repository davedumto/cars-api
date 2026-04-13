import config from "./config.js";

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": config.allowedOrigins,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(JSON.stringify(payload));
}

function sendBadRequest(response, message) {
  sendJson(response, 400, {
    success: false,
    message
  });
}

function sendMethodNotAllowed(response) {
  sendJson(response, 405, {
    success: false,
    message: "Method not allowed."
  });
}

function sendNotFound(response) {
  sendJson(response, 404, {
    success: false,
    message: "Route not found."
  });
}

function handleOptions(response) {
  response.writeHead(204, {
    "Access-Control-Allow-Origin": config.allowedOrigins,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end();
}

export {
  handleOptions,
  sendBadRequest,
  sendJson,
  sendMethodNotAllowed,
  sendNotFound
};
