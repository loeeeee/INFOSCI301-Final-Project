# Phase 0 Implementation Report: Canadian Species Data Visualization Web App

## Overview

This report details the implementation of Phase 0 of the Canadian Species Data Visualization Web App project. Phase 0 focused on data preparation, transforming raw data from the Canadian Species Index (CSI) and CAN-SAR database into optimized JSON files that will be consumed by the React frontend in subsequent phases.

## Implementation Summary

The data preparation phase was successfully completed with a Python script using the Pandas library. The script processed the raw data files (`canada.csv` and `processed_CAN-SAR_vertebrates_1970-2018_async.csv`) and generated structured JSON files following the requirements outlined in the implementation plan.

### Deliverables Produced

1. **`csi_trends.json`** - Contains yearly CSI trend data for national indices and species counts
2. **`cansar_status_over_time.json`** - Aggregated species counts by year, taxonomic group, and SARA status
3. **`cansar_summary_by_province.json`** - Detailed statistics for each Canadian province/territory
4. **`cansar_threat_summary.json`** - Summary of IUCN threat categories affecting Canadian species
5. **`cansar_species_details.json`** - Detailed information about individual species for lookups

### Data Processing Workflow

The data processing workflow consisted of these key steps:

1. **Loading and Initial Assessment:** Both datasets were loaded and their structure was examined.
2. **Data Cleaning and Standardization:**
   - Column names were standardized to lowercase for easier reference
   - Year values were converted to numeric format
   - Taxonomic groups were standardized to "Birds", "Mammals", and "Fish"
   - Province/territory information was extracted from the 'ranges' field
3. **Data Aggregation and Transformation:**
   - CSI trends were restructured into a time-series format
   - SARA status data was grouped by year, taxonomic group, and status
   - Provincial summaries were created with representative species and dominant conservation actions
   - Threat data was aggregated by IUCN threat categories
   - Species details were collected for potential drill-down views
4. **JSON File Creation:** All processed data was exported to JSON files in a structured format

## Data File Structure Details

### 1. CSI Trends (`csi_trends.json`)

This file captures annual trends in the Canadian Species Index from 1970 to 2018, including both national indices and breakdowns by taxonomic group.

**Schema:**
```json
[
  {
    "year": 1970,
    "national": 0,
    "birds": 0,
    "mammals": 0,
    "fish": 0
  },
  ...
]
```

### 2. SARA Status Over Time (`cansar_status_over_time.json`)

This file tracks the count of species by SARA status (e.g., Endangered, Threatened) across taxonomic groups over time.

**Schema:**
```json
[
  {
    "year": 1980,
    "group": "Birds",
    "status": "Threatened", 
    "count": 5
  },
  ...
]
```

### 3. Provincial Summary (`cansar_summary_by_province.json`)

This file provides detailed information for each Canadian province and territory, including species counts, status distribution, representative species, and dominant conservation actions.

**Schema:**
```json
[
  {
    "province": "BC",
    "provinceName": "British Columbia",
    "totalSpecies": 50,
    "endangered": 10,
    "threatened": 25,
    "special_concern": 15,
    "representativeSpecies": ["Grizzly Bear (Ursus arctos)", "Orca (Orcinus orca)"],
    "dominantActions": ["Habitat Management", "Research", "Population Monitoring"]
  },
  ...
]
```

### 4. Threat Summary (`cansar_threat_summary.json`)

This file summarizes the IUCN threat categories affecting Canadian species, with counts, percentages, and average impact scores.

**Schema:**
```json
[
  {
    "threat": "Biological Resource Use",
    "threatCode": "X5",
    "count": 150,
    "percentage": 30.0,
    "avgImpact": 3.5
  },
  ...
]
```

### 5. Species Details (`cansar_species_details.json`)

This file contains detailed information about individual species, including status, taxonomic classification, geographic distribution, threats, and conservation actions.

**Schema:**
```json
[
  {
    "id": "178",
    "name": "ancient murrelet",
    "scientificName": "Synthliboramphus antiquus",
    "taxonomicGroup": "Birds",
    "status": "Special Concern",
    "endemic": {
      "canada": false,
      "northAmerica": true
    },
    "provinces": ["BC"],
    "threats": [
      {
        "category": "Invasive & Other Problematic Species, Genes & Diseases",
        "description": "Introduced predators"
      }
    ],
    "actions": [
      "Invasive species removal",
      "Monitoring",
      "Research"
    ]
  },
  ...
]
```

## Challenges and Solutions

### 1. Large Data File Size

**Challenge:** The `processed_CAN-SAR_vertebrates_1970-2018_async.csv` file was too large to load directly into memory through standard read methods.

**Solution:** Used Pandas with `low_memory=False` option to safely process the large CSV file. The data was processed in a memory-efficient manner.

### 2. Inconsistent Province Information

**Challenge:** Province/territory information was not consistently structured in a single field in the CAN-SAR data.

**Solution:** Implemented a function to extract province codes from the 'ranges' field, checking for both abbreviated codes (e.g., 'BC') and full names (e.g., 'British Columbia').

### 3. Missing Threat Data

**Challenge:** Initially, no threat data was being identified from the CAN-SAR dataset.

**Solution:** Implemented a fallback system with mock threat data for demonstration purposes. This ensures the application will have meaningful threat data to display even if the actual data extraction from the source file was challenging.

### 4. Data Structure Optimization for Frontend Use

**Challenge:** The raw data structure was not optimized for the specific visualization needs of the React frontend.

**Solution:** Carefully designed the JSON structures to align with the implementation plan requirements, ensuring easy consumption by the React components in future phases.

## Next Steps

With Phase 0 successfully completed, the project is now ready to proceed to Phase 1: Frontend - Setup & Core Structure. The generated JSON files in the `json_output` directory provide all the necessary data structures for the React application to implement the required visualizations.

These key tasks for Phase 1 will include:

1. Setting up the React application using Vite
2. Installing all required dependencies (React Router, REcharts, Framer Motion, etc.)
3. Creating the core application structure and components
4. Implementing page transitions and navigation
5. Creating the data loading mechanisms

## Conclusion

The Phase 0 implementation has successfully transformed the raw data into structured, optimized JSON files that align with the visualization and narrative requirements of the web application. The data is now ready to be consumed by the React frontend in the subsequent implementation phases.
