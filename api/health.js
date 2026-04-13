import { handleHealth } from "../src/handlers.js";

export default async function handler(request, response) {
  await handleHealth(request, response);
}
