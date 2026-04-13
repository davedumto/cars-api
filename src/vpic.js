import { MemoryCache } from "./cache.js";
import config from "./config.js";
import { getMakeAssetData } from "./make-assets.js";

const cache = new MemoryCache(config.cacheTtlMs);

async function getJson(path) {
  const cacheKey = path;
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const url = new URL(path, `${config.vpicBaseUrl}/`);
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`vPIC request failed with status ${response.status}`);
  }

  const payload = await response.json();
  cache.set(cacheKey, payload);
  return payload;
}

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeMake(make) {
  const name = cleanText(make.MakeName);
  const assets = getMakeAssetData(name);

  return {
    id: make.MakeId,
    name,
    website: assets.website,
    logoUrl: assets.logoUrl
  };
}

function normalizeModel(model) {
  const makeName = cleanText(model.Make_Name || model.MakeName);
  const assets = getMakeAssetData(makeName);

  return {
    makeId: model.Make_ID || model.MakeId || null,
    makeName,
    modelId: model.Model_ID || model.ModelId || null,
    modelName: cleanText(model.Model_Name || model.ModelName),
    year: model.ModelYear || null,
    makeWebsite: assets.website,
    makeLogoUrl: assets.logoUrl
  };
}

function getYears() {
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 1;
  const years = [];

  for (let year = maxYear; year >= config.minYear; year -= 1) {
    years.push(year);
  }

  return years;
}

async function getCarMakes() {
  const payload = await getJson("GetMakesForVehicleType/car");
  return (payload.Results || [])
    .map(normalizeMake)
    .filter((make) => make.id && make.name)
    .sort((left, right) => left.name.localeCompare(right.name));
}

async function getModelsByMakeAndYear({ makeId, makeName, year }) {
  let path;

  if (makeId) {
    path = `GetModelsForMakeIdYear/makeId/${encodeURIComponent(makeId)}/modelyear/${encodeURIComponent(year)}`;
  } else {
    path = `GetModelsForMakeYear/make/${encodeURIComponent(makeName)}/modelyear/${encodeURIComponent(year)}`;
  }

  const payload = await getJson(path);

  return (payload.Results || [])
    .map((result) => normalizeModel({ ...result, ModelYear: year }))
    .filter((model) => model.modelName)
    .sort((left, right) => left.modelName.localeCompare(right.modelName));
}

export {
  getYears,
  getCarMakes,
  getModelsByMakeAndYear
};
