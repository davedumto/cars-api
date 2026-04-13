const { handleVehicleOptions } = require("../src/handlers");

module.exports = async function handler(request, response) {
  await handleVehicleOptions(request, response);
};
