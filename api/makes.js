import { handleMakes } from "../src/handlers.js";

export default async function handler(request, response) {
  await handleMakes(request, response);
}
