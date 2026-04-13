const DEFAULT_PORT = 3000;
const DEFAULT_CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const DEFAULT_MIN_YEAR = 1980;

function getNumber(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

module.exports = {
  port: getNumber(process.env.PORT, DEFAULT_PORT),
  vpicBaseUrl: process.env.VPIC_BASE_URL || "https://vpic.nhtsa.dot.gov/api/vehicles",
  allowedOrigins: process.env.ALLOWED_ORIGINS || "*",
  cacheTtlMs: getNumber(process.env.CACHE_TTL_MS, DEFAULT_CACHE_TTL_MS),
  minYear: getNumber(process.env.MIN_YEAR, DEFAULT_MIN_YEAR)
};
