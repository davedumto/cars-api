import { handleYears } from "../src/handlers.js";

export default async function handler(request, response) {
  await handleYears(request, response);
}
