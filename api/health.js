const { handleHealth } = require("../src/handlers");

module.exports = async function handler(request, response) {
  await handleHealth(request, response);
};
