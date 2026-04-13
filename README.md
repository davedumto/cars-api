# Cars API

Simple backend API for GoHighLevel forms that need a car year, make, and model dropdown instead of free-text input.

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

### `GET /api/years`

Returns a descending year list.

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

### `GET /api/models?year=2024&makeId=440`

Returns models for a selected make and year.

You can also use `makeName` instead of `makeId`:

```text
/api/models?year=2024&makeName=Toyota
```

### `GET /api/vehicle-options`

Convenience endpoint for a cascading form.

- No query params: returns years
- `?year=2024`: returns makes
- `?year=2024&makeId=440`: returns models

## GoHighLevel flow

Recommended dropdown flow:

1. Load `/api/years` for the year field.
2. After year selection, load `/api/makes`.
3. After make selection, load `/api/models?year=2024&makeId=440`.
4. Save the selected `year`, `makeName`, and `modelName` into your form submission.

## Deployment notes

- This project now works both as a local Node server and as Vercel API functions.
- On Vercel, the routes live under `/api/*` and do not require a custom `server.listen(...)` process.
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
