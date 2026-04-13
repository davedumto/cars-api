# Cars API

Simple backend API for GoHighLevel forms that need a car year, make, and model dropdown instead of free-text input.

Production base URL:

```text
https://cars-api-azure.vercel.app
```

## What it does

- Returns a list of years for a dropdown.
- Returns car makes from the NHTSA vPIC dataset.
- Returns car models for a selected make and year.
- Enables CORS so your frontend form can call it from the browser.

## Quick start

```bash
npm start
```

The local server starts on `http://localhost:3000` by default.

## Environment variables

| Name | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | Port for the API |
| `ALLOWED_ORIGINS` | `*` | CORS origin value |
| `VPIC_BASE_URL` | `https://vpic.nhtsa.dot.gov/api/vehicles` | Upstream vehicle dataset |
| `CACHE_TTL_MS` | `21600000` | Cache time for upstream responses |
| `MIN_YEAR` | `1980` | Oldest year returned by `/api/years` |

## Endpoints

### `GET /health` for local Node server

Local health check when running `npm start`.

### `GET /api/health` for Vercel

Health check for Vercel deployment.

Example:

```text
GET https://cars-api-azure.vercel.app/api/health
```

Example response:

```json
{
  "success": true,
  "service": "cars-api",
  "timestamp": "2026-04-13T09:27:23.139Z"
}
```

### `GET /api/years`

Returns a descending year list.

Example:

```text
GET https://cars-api-azure.vercel.app/api/years
```

Example response:

```json
{
  "success": true,
  "total": 47,
  "data": [2027, 2026, 2025]
}
```

### `GET /api/makes`

Returns available car makes.

Example:

```text
GET https://cars-api-azure.vercel.app/api/makes
```

Example response:

```json
{
  "success": true,
  "total": 193,
  "data": [
    {
      "id": 448,
      "name": "TOYOTA"
    },
    {
      "id": 474,
      "name": "HONDA"
    }
  ]
}
```

### `GET /api/models?year=2024&makeId=440`

Returns models for a selected make and year.

Required query params:

- `year`
- one of `makeId` or `makeName`

Examples:

```text
GET https://cars-api-azure.vercel.app/api/models?year=2024&makeId=448
GET https://cars-api-azure.vercel.app/api/models?year=2024&makeName=Toyota
```

You can also use `makeName` instead of `makeId`:

```text
/api/models?year=2024&makeName=Toyota
```

Example response:

```json
{
  "success": true,
  "total": 2,
  "filters": {
    "year": 2024,
    "makeId": 448,
    "makeName": null
  },
  "data": [
    {
      "makeId": 448,
      "makeName": "TOYOTA",
      "modelId": 1861,
      "modelName": "Camry",
      "year": "2024"
    },
    {
      "makeId": 448,
      "makeName": "TOYOTA",
      "modelId": 1863,
      "modelName": "Corolla",
      "year": "2024"
    }
  ]
}
```

Validation errors:

```json
{
  "success": false,
  "message": "The 'year' query parameter is required."
}
```

```json
{
  "success": false,
  "message": "Provide either 'makeId' or 'makeName'."
}
```

### `GET /api/vehicle-options`

Convenience endpoint for a cascading form.

- No query params: returns years
- `?year=2024`: returns makes
- `?year=2024&makeId=440`: returns models

Examples:

```text
GET https://cars-api-azure.vercel.app/api/vehicle-options
GET https://cars-api-azure.vercel.app/api/vehicle-options?year=2024
GET https://cars-api-azure.vercel.app/api/vehicle-options?year=2024&makeId=448
```

Example response with no params:

```json
{
  "success": true,
  "step": "year",
  "data": {
    "years": [2027, 2026, 2025]
  }
}
```

Example response with `year` only:

```json
{
  "success": true,
  "step": "make",
  "filters": {
    "year": 2024
  },
  "data": {
    "makes": [
      {
        "id": 448,
        "name": "TOYOTA"
      }
    ]
  }
}
```

Example response with `year` and `makeId`:

```json
{
  "success": true,
  "step": "model",
  "filters": {
    "year": 2024,
    "makeId": 448,
    "makeName": null
  },
  "data": {
    "models": [
      {
        "makeId": 448,
        "makeName": "TOYOTA",
        "modelId": 1861,
        "modelName": "Camry",
        "year": "2024"
      }
    ]
  }
}
```

## Fetching guide

Base URL:

```text
https://cars-api-azure.vercel.app
```

### Fetch years

```js
const response = await fetch("https://cars-api-azure.vercel.app/api/years");
const payload = await response.json();

console.log(payload.data);
```

### Fetch makes

```js
const response = await fetch("https://cars-api-azure.vercel.app/api/makes");
const payload = await response.json();

console.log(payload.data);
```

### Fetch models with `makeId`

```js
const year = 2024;
const makeId = 448;

const response = await fetch(
  `https://cars-api-azure.vercel.app/api/models?year=${year}&makeId=${makeId}`
);
const payload = await response.json();

console.log(payload.data);
```

### Fetch models with `makeName`

```js
const year = 2024;
const makeName = "Toyota";

const response = await fetch(
  `https://cars-api-azure.vercel.app/api/models?year=${year}&makeName=${encodeURIComponent(makeName)}`
);
const payload = await response.json();

console.log(payload.data);
```

### Safe fetch helper

Use this pattern in your frontend so errors are easier to handle:

```js
async function fetchJson(url) {
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}
```

## GoHighLevel fetch flow

Recommended field order:

1. `year`
2. `make`
3. `model`

Recommended request flow:

1. On page load, fetch `/api/years`
2. When `year` changes, fetch `/api/makes`
3. When `make` changes, fetch `/api/models?year=SELECTED_YEAR&makeId=SELECTED_MAKE_ID`
4. Save both the label and id where useful

Minimal example:

```js
const API_BASE = "https://cars-api-azure.vercel.app";

async function loadYears() {
  const payload = await fetchJson(`${API_BASE}/api/years`);
  return payload.data;
}

async function loadMakes() {
  const payload = await fetchJson(`${API_BASE}/api/makes`);
  return payload.data;
}

async function loadModels(year, makeId) {
  const payload = await fetchJson(
    `${API_BASE}/api/models?year=${year}&makeId=${makeId}`
  );
  return payload.data;
}
```

## Response shape summary

### Years

```json
{
  "success": true,
  "total": 48,
  "data": [2027, 2026, 2025]
}
```

### Makes

```json
{
  "success": true,
  "total": 193,
  "data": [
    {
      "id": 448,
      "name": "TOYOTA"
    }
  ]
}
```

### Models

```json
{
  "success": true,
  "total": 10,
  "filters": {
    "year": 2024,
    "makeId": 448,
    "makeName": null
  },
  "data": [
    {
      "makeId": 448,
      "makeName": "TOYOTA",
      "modelId": 1861,
      "modelName": "Camry",
      "year": "2024"
    }
  ]
}
```

## Error handling

Common API errors:

- `400` if `year` is missing on `/api/models`
- `400` if both `makeId` and `makeName` are missing on `/api/models`
- `405` if you use a method other than `GET`
- `502` if the upstream NHTSA vehicle API fails

Example upstream error:

```json
{
  "success": false,
  "message": "Unable to load vehicle data from the upstream source.",
  "error": "fetch failed"
}
```

## GoHighLevel flow

Recommended dropdown flow:

1. Load `/api/years` for the year field.
2. After year selection, load `/api/makes`.
3. After make selection, load `/api/models?year=2024&makeId=440`.
4. Save the selected `year`, `makeName`, and `modelName` into your form submission.

## Deployment notes

- This project now works both as a local Node server and as Vercel API functions.
- On Vercel, the routes live under `/api/*` and do not require a custom `server.listen(...)` process.
- The project uses ESM (`\"type\": \"module\"`) so Vercel can load the function exports correctly.
- You can still deploy the local server version to Render, Railway, Fly.io, or a VPS.
- Set `ALLOWED_ORIGINS` to your GoHighLevel page domain in production.
- The API depends on the NHTSA vPIC service for live make/model data.

## Deploy to Vercel

### Option 1: Deploy with GitHub

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Vercel will detect the project automatically.
4. Add `ALLOWED_ORIGINS` in Project Settings if you want to restrict browser access.
5. Deploy.

### Option 2: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

During deploy:

- Use the current directory
- Keep the default project settings
- Add `ALLOWED_ORIGINS` later in the Vercel dashboard if needed

### After deploy

Your production routes will look like:

- `https://your-project.vercel.app/api/health`
- `https://your-project.vercel.app/api/years`
- `https://your-project.vercel.app/api/makes`
- `https://your-project.vercel.app/api/models?year=2024&makeId=448`

### Recommended production env

- `ALLOWED_ORIGINS=https://your-gohighlevel-page-domain.com`
- `CACHE_TTL_MS=21600000`
- `MIN_YEAR=1980`

## Vercel routes

After deployment to Vercel, use:

- `/api/health`
- `/api/years`
- `/api/makes`
- `/api/models?year=2024&makeId=448`
- `/api/vehicle-options`
