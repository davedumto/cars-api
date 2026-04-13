const { handleMakes } = require("../src/handlers");

module.exports = async function handler(request, response) {
  await handleMakes(request, response);
};
