import { handleVehicleOptions } from "../src/handlers.js";

export default async function handler(request, response) {
  await handleVehicleOptions(request, response);
}
