import { handleModels } from "../src/handlers.js";

export default async function handler(request, response) {
  await handleModels(request, response);
}
