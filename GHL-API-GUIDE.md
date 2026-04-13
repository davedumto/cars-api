# Cars API Guide For GoHighLevel

This guide explains the car lookup API in simple terms.

Use this API when you want a person filling your GoHighLevel form to choose:

- car year
- car make
- car model

instead of typing everything manually.

## Base URL

Use this as the main API base:

```text
https://cars-api-azure.vercel.app
```

## What this API does

The API helps you build 3 linked dropdowns in your form:

1. Year
2. Make
3. Model

The idea is:

1. The user first selects the car year
2. Then they select the car make
3. Then they select the car model

This makes the form easier to fill and helps reduce typing mistakes.

## The endpoints you will use

### 1. Get all years

Use this endpoint to load the year dropdown.

```text
GET https://cars-api-azure.vercel.app/api/years
```

What it returns:

- a list of years like `2027`, `2026`, `2025`

Example response:

```json
{
  "success": true,
  "total": 48,
  "data": [2027, 2026, 2025]
}
```

## 2. Get all car makes

Use this endpoint to load the make dropdown.

```text
GET https://cars-api-azure.vercel.app/api/makes
```

What it returns:

- a list of car brands like Toyota, Honda, BMW, Ford

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

Important:

- each make has an `id`
- that `id` is what you use to get the models

## 3. Get car models

Use this endpoint after the user has selected:

- a year
- a make

Example:

```text
GET https://cars-api-azure.vercel.app/api/models?year=2024&makeId=448
```

In this example:

- `year=2024`
- `makeId=448` means Toyota

What it returns:

- the models for that make in that year

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

## 4. Health check

This is mostly for testing if the API is alive.

```text
GET https://cars-api-azure.vercel.app/api/health
```

If it is working, you will get something like:

```json
{
  "success": true,
  "service": "cars-api"
}
```

## Recommended GoHighLevel flow

Here is the easiest way to use it in a form:

### Step 1

When the page loads, fetch:

```text
/api/years
```

Use the result to fill the Year dropdown.

### Step 2

When the user selects a year, fetch:

```text
/api/makes
```

Use the result to fill the Make dropdown.

### Step 3

When the user selects a make, fetch:

```text
/api/models?year=SELECTED_YEAR&makeId=SELECTED_MAKE_ID
```

Use the result to fill the Model dropdown.

## Very simple example

If the person chooses:

- Year: `2024`
- Make: `TOYOTA`

Then you call:

```text
https://cars-api-azure.vercel.app/api/models?year=2024&makeId=448
```

Then the API returns Toyota models for 2024.

## What you should save in the form

When the user finishes, it is best to save:

- `year`
- `makeName`
- `modelName`

If you want, you can also save:

- `makeId`
- `modelId`

## Important notes

### 1. Use the make id

When loading models, the best option is to use `makeId` from `/api/makes`.

### 2. The models depend on the selected year

A make can have different models for different years.

That is why the models endpoint needs both:

- `year`
- `makeId`

### 3. This API depends on NHTSA vehicle data

The car makes and models come from the NHTSA vehicle database.

So if that external service has a problem, makes or models may temporarily fail.

## Common links

Use these directly:

- Years: [https://cars-api-azure.vercel.app/api/years](https://cars-api-azure.vercel.app/api/years)
- Makes: [https://cars-api-azure.vercel.app/api/makes](https://cars-api-azure.vercel.app/api/makes)
- Health: [https://cars-api-azure.vercel.app/api/health](https://cars-api-azure.vercel.app/api/health)
- Example models: [https://cars-api-azure.vercel.app/api/models?year=2024&makeId=448](https://cars-api-azure.vercel.app/api/models?year=2024&makeId=448)

## In one sentence

Load years first, then makes, then models using the selected year and make id.
