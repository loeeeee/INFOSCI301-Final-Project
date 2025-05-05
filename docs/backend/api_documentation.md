# Canadian Species Data API Documentation

This document provides detailed information about the available API endpoints for the Canadian Species Data Visualization project. These endpoints serve data from both the Canadian Species Index (CSI) and the Canadian Species at Risk (CAN-SAR) database.

## Base URL

```
http://143.198.213.16:5000
```

## Available Endpoints

### 1. CSI Trends

Retrieves the Canadian Species Index trend data from 1970 to 2018, including national index and group-specific indices.

**Endpoint:** `/api/csi-trends`

**Method:** GET

**Parameters:** None

**Response Format:**
```json
[
  {
    "year": 1970,
    "national_index": 0.0,
    "birds_index": 0.0,
    "mammals_index": 0.0,
    "fish_index": 0.0,
    "number_species": 449,
    "number_bird_species": 337,
    "number_mammal_species": 27,
    "number_fish_species": 85
  },
  {
    "year": 1971,
    "national_index": 1.45,
    "birds_index": 1.27,
    "mammals_index": -8.81,
    "fish_index": 5.68,
    "number_species": 460,
    "number_bird_species": 339,
    "number_mammal_species": 31,
    "number_fish_species": 90
  },
  // ... more years
]
```

**Usage Example:**
```javascript
// Frontend fetch example
fetch('http://143.198.213.16:5000/api/csi-trends')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 2. Status Over Time

Retrieves species status assessment data grouped by year and SARA status.

**Endpoint:** `/api/cansar/status-over-time`

**Method:** GET

**Parameters:**
- `group` (optional): Filter results by taxonomic group (e.g., "Birds", "Fishes (freshwater)", "Mammals (terrestrial)")

**Response Format:**
```json
[
  {
    "year": 2003,
    "status": "Endangered",
    "count": 42
  },
  {
    "year": 2003,
    "status": "Threatened",
    "count": 28
  },
  {
    "year": 2003,
    "status": "Special Concern",
    "count": 36
  },
  // ... more status entries
]
```

**Usage Example:**
```javascript
// Frontend fetch example for all groups
fetch('http://143.198.213.16:5000/api/cansar/status-over-time')
  .then(response => response.json())
  .then(data => console.log(data));

// Frontend fetch example for Birds only
fetch('http://143.198.213.16:5000/api/cansar/status-over-time?group=Birds')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 3. Province/Territory Summary

Retrieves a summary of species at risk by province/territory, including representative species examples.

**Endpoint:** `/api/cansar/summary/province`

**Method:** GET

**Parameters:** None

**Response Format:**
```json
[
  {
    "province": "BC",
    "species_count": 189,
    "representative_species": [
      {
        "common_name": "Ancient Murrelet",
        "scientific_name": "Synthliboramphus antiquus",
        "taxonomic_group": "Birds",
        "sara_status": "Special Concern"
      },
      // ... up to 5 representative species
    ]
  },
  {
    "province": "ON",
    "species_count": 157,
    "representative_species": [
      // ... up to 5 representative species
    ]
  },
  // ... more provinces
]
```

**Usage Example:**
```javascript
// Frontend fetch example
fetch('http://143.198.213.16:5000/api/cansar/summary/province')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 4. Threat Summary

Retrieves a summary of threats affecting species at risk, grouped by IUCN threat code.

**Endpoint:** `/api/cansar/summary/threats`

**Method:** GET

**Parameters:** None

**Response Format:**
```json
[
  {
    "threat_code": "X1",
    "count": 246,
    "average_impact": 1.78
  },
  {
    "threat_code": "X2",
    "count": 198,
    "average_impact": 1.42
  },
  // ... more threat categories
]
```

**IUCN Threat Codes:**
- X1: Residential & commercial development
- X2: Agriculture & aquaculture
- X3: Energy production & mining
- X4: Transportation & service corridors
- X5: Biological resource use
- X6: Human intrusions & disturbance
- X7: Natural system modifications
- X8: Invasive & other problematic species, genes & diseases
- X9: Pollution
- X10: Geological events
- X11: Climate change & severe weather

**Usage Example:**
```javascript
// Frontend fetch example
fetch('http://143.198.213.16:5000/api/cansar/summary/threats')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 5. Actions Summary

Retrieves a summary of conservation actions by action type.

**Endpoint:** `/api/cansar/summary/actions`

**Method:** GET

**Parameters:** None

**Response Format:**
```json
[
  {
    "action_type": "Education, Monitoring, Research",
    "count": 76
  },
  {
    "action_type": "Habitat management",
    "count": 52
  },
  {
    "action_type": "Research and monitoring",
    "count": 48
  },
  // ... more action types
]
```

**Usage Example:**
```javascript
// Frontend fetch example
fetch('http://143.198.213.16:5000/api/cansar/summary/actions')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Error Handling

All endpoints will return appropriate HTTP status codes:

- 200: Success
- 400: Bad Request (e.g., invalid parameters)
- 404: Resource Not Found
- 500: Internal Server Error

Error responses include a JSON object with an error message:

```json
{
  "error": "Description of the error"
}
```

## CORS Support

The API has CORS enabled, allowing access from any origin. This allows the frontend application to make requests to the API from a different domain.

## Rate Limiting

There are currently no rate limits for this API. However, please be considerate with your requests to ensure optimal performance for all users.
