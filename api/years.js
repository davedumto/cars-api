const { handleYears } = require("../src/handlers");

module.exports = async function handler(request, response) {
  await handleYears(request, response);
};
