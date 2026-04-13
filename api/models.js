const { handleModels } = require("../src/handlers");

module.exports = async function handler(request, response) {
  await handleModels(request, response);
};
