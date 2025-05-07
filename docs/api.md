# API Documentation

## Overview

The API provides endpoints for accessing and manipulating Canadian vertebrate species at risk data. It follows RESTful principles and uses JSON for data exchange.

## Base URL

```
http://localhost:8787/api
```

## Authentication

The API uses JWT token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Endpoints

### Species

#### Get All Species

```http
GET /species
```

Query Parameters:
- `region` (optional): Filter by region
- `status` (optional): Filter by conservation status
- `year` (optional): Filter by assessment year
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

Response:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "scientific_name": "string",
      "status": "string",
      "population_trend": "string",
      "region": "string",
      "last_assessment": "date"
    }
  ],
  "pagination": {
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
}
```

#### Get Species by ID

```http
GET /species/{id}
```

Path Parameters:
- `id`: Species identifier

Response:
```json
{
  "id": "string",
  "name": "string",
  "scientific_name": "string",
  "status": "string",
  "population_trend": "string",
  "region": "string",
  "last_assessment": "date",
  "description": "string",
  "habitat": "string",
  "threats": ["string"],
  "conservation_measures": ["string"]
}
```

#### Get Species Trends

```http
GET /species/{id}/trends
```

Path Parameters:
- `id`: Species identifier

Query Parameters:
- `start_year` (optional): Start year for trend data
- `end_year` (optional): End year for trend data

Response:
```json
{
  "species_id": "string",
  "trends": [
    {
      "year": "integer",
      "population_index": "float",
      "confidence_interval": {
        "lower": "float",
        "upper": "float"
      }
    }
  ]
}
```

### Regions

#### Get All Regions

```http
GET /regions
```

Query Parameters:
- `type` (optional): Filter by region type
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

Response:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "coordinates": ["float"],
      "species_count": "integer"
    }
  ],
  "pagination": {
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
}
```

#### Get Region by ID

```http
GET /regions/{id}
```

Path Parameters:
- `id`: Region identifier

Response:
```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "coordinates": ["float"],
  "species_count": "integer",
  "description": "string",
  "area": "float",
  "protected_areas": ["string"]
}
```

#### Get Species in Region

```http
GET /regions/{id}/species
```

Path Parameters:
- `id`: Region identifier

Query Parameters:
- `status` (optional): Filter by conservation status
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

Response:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "scientific_name": "string",
      "status": "string",
      "population_trend": "string"
    }
  ],
  "pagination": {
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
}
```

### Statistics

#### Get Overall Statistics

```http
GET /statistics
```

Response:
```json
{
  "total_species": "integer",
  "status_distribution": {
    "endangered": "integer",
    "threatened": "integer",
    "special_concern": "integer"
  },
  "region_distribution": {
    "region_id": "integer"
  },
  "trend_summary": {
    "increasing": "integer",
    "decreasing": "integer",
    "stable": "integer",
    "unknown": "integer"
  }
}
```

## Error Responses

The API uses standard HTTP status codes and returns error details in the response body:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1617235200
```

## Versioning

The API version is included in the URL path:

```
http://localhost:8787/api/v1/species
```

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for web applications. Allowed origins can be configured in the backend settings.

## WebSocket Support

The API provides WebSocket endpoints for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:8787/ws/species-updates');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle update
};
```

## Examples

### Python

```python
import requests

# Get all species
response = requests.get('http://localhost:8787/api/species')
species = response.json()

# Get species by ID
response = requests.get('http://localhost:8787/api/species/123')
species_details = response.json()

# Get species trends
response = requests.get(
    'http://localhost:8787/api/species/123/trends',
    params={'start_year': 2010, 'end_year': 2020}
)
trends = response.json()
```

### JavaScript

```javascript
// Get all species
const response = await fetch('http://localhost:8787/api/species');
const species = await response.json();

// Get species by ID
const response = await fetch('http://localhost:8787/api/species/123');
const speciesDetails = await response.json();

// Get species trends
const response = await fetch(
    'http://localhost:8787/api/species/123/trends?start_year=2010&end_year=2020'
);
const trends = await response.json();
```

## Best Practices

1. **Error Handling**
   - Always check response status codes
   - Handle rate limiting
   - Implement retry logic for failed requests

2. **Performance**
   - Use pagination for large datasets
   - Implement caching where appropriate
   - Minimize payload size

3. **Security**
   - Use HTTPS in production
   - Implement proper authentication
   - Validate input data 