import { getYears, getCarMakes, getModelsByMakeAndYear } from "./vpic.js";
import {
  handleOptions,
  sendBadRequest,
  sendJson,
  sendMethodNotAllowed,
  sendNotFound
} from "./http.js";

function getBaseUrl(request) {
  return `http://${request.headers.host || "localhost"}`;
}

function getRequestUrl(request) {
  return new URL(request.url, getBaseUrl(request));
}

function ensureGetRequest(request, response) {
  if (request.method === "OPTIONS") {
    handleOptions(response);
    return false;
  }

  if (request.method !== "GET") {
    sendMethodNotAllowed(response);
    return false;
  }

  return true;
}

async function withUpstreamErrorHandling(response, callback) {
  try {
    await callback();
  } catch (error) {
    sendJson(response, 502, {
      success: false,
      message: "Unable to load vehicle data from the upstream source.",
      error: error.message
    });
  }
}

async function handleHealth(request, response) {
  if (!ensureGetRequest(request, response)) {
    return;
  }

  sendJson(response, 200, {
    success: true,
    service: "cars-api",
    timestamp: new Date().toISOString()
  });
}

async function handleYears(request, response) {
  if (!ensureGetRequest(request, response)) {
    return;
  }

  const years = getYears();
  sendJson(response, 200, {
    success: true,
    total: years.length,
    data: years
  });
}

async function handleMakes(request, response) {
  if (!ensureGetRequest(request, response)) {
    return;
  }

  await withUpstreamErrorHandling(response, async () => {
    const makes = await getCarMakes();
    sendJson(response, 200, {
      success: true,
      total: makes.length,
      data: makes
    });
  });
}

async function handleModels(request, response) {
  if (!ensureGetRequest(request, response)) {
    return;
  }

  const url = getRequestUrl(request);
  const year = url.searchParams.get("year");
  const makeId = url.searchParams.get("makeId");
  const makeName = url.searchParams.get("makeName");

  if (!year) {
    sendBadRequest(response, "The 'year' query parameter is required.");
    return;
  }

  if (!makeId && !makeName) {
    sendBadRequest(response, "Provide either 'makeId' or 'makeName'.");
    return;
  }

  await withUpstreamErrorHandling(response, async () => {
    const models = await getModelsByMakeAndYear({ year, makeId, makeName });

    sendJson(response, 200, {
      success: true,
      total: models.length,
      filters: {
        year: Number(year),
        makeId: makeId ? Number(makeId) : null,
        makeName: makeName || null
      },
      data: models
    });
  });
}

async function handleVehicleOptions(request, response) {
  if (!ensureGetRequest(request, response)) {
    return;
  }

  const url = getRequestUrl(request);
  const year = url.searchParams.get("year");

  if (!year) {
    sendJson(response, 200, {
      success: true,
      step: "year",
      data: {
        years: getYears()
      }
    });
    return;
  }

  const makeId = url.searchParams.get("makeId");
  const makeName = url.searchParams.get("makeName");

  await withUpstreamErrorHandling(response, async () => {
    if (!makeId && !makeName) {
      const makes = await getCarMakes();

      sendJson(response, 200, {
        success: true,
        step: "make",
        filters: {
          year: Number(year)
        },
        data: {
          makes
        }
      });
      return;
    }

    const models = await getModelsByMakeAndYear({ year, makeId, makeName });

    sendJson(response, 200, {
      success: true,
      step: "model",
      filters: {
        year: Number(year),
        makeId: makeId ? Number(makeId) : null,
        makeName: makeName || null
      },
      data: {
        models
      }
    });
  });
}

async function handleRouter(request, response) {
  const url = getRequestUrl(request);

  if (url.pathname === "/health") {
    await handleHealth(request, response);
    return;
  }

  if (url.pathname === "/api/years") {
    await handleYears(request, response);
    return;
  }

  if (url.pathname === "/api/makes") {
    await handleMakes(request, response);
    return;
  }

  if (url.pathname === "/api/models") {
    await handleModels(request, response);
    return;
  }

  if (url.pathname === "/api/vehicle-options") {
    await handleVehicleOptions(request, response);
    return;
  }

  if (request.method === "OPTIONS") {
    handleOptions(response);
    return;
  }

  sendNotFound(response);
}

export {
  handleHealth,
  handleMakes,
  handleModels,
  handleRouter,
  handleVehicleOptions,
  handleYears
};
