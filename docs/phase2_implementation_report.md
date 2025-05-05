# Phase 2 Implementation Report: Canadian Species Data Visualization Web App

## Overview

This report details the implementation of Phase 2 of the Canadian Species Data Visualization Web App project. Phase 2 focused on implementing the interactive visualizations for each page of the application, building upon the foundation established in Phase 1. The visualizations provide users with meaningful insights into Canadian species population trends and conservation status.

## Implementation Summary

Phase 2 has been successfully completed with the following components and features implemented:

1. **Chart Components**
   - Created reusable chart components using REcharts
   - Implemented LineChart, BarChart, PieChart, and ComposedChart components
   - Added interactive tooltips, legends, and responsive layouts

2. **Map Implementation**
   - Developed an interactive map of Canadian provinces using react-simple-maps
   - Implemented province hovering and clicking interactions
   - Created a detailed ProvincePanel component for displaying province-specific data

3. **Data Visualizations**
   - Implemented CSI trends visualization on the HomePage
   - Created SARA status distribution charts
   - Added threat summary visualizations on the FindingsPage
   - Enhanced the ImportancePage with highlighted trend data

4. **Integration**
   - Connected visualizations to data from DataContext
   - Added filtering capabilities for taxonomic groups
   - Ensured responsiveness across different screen sizes

## Technical Implementation Details

### Chart Components

We created a set of reusable chart components that form the core of our data visualizations:

1. **LineChart**: Used for time-series data like the CSI trends, featuring multiple lines with custom colors, tooltips showing precise values, and responsive sizing.

2. **BarChart**: Implemented for categorical data comparisons, supporting both regular and stacked bar configurations, with options for label rotation and value labels.

3. **PieChart**: Created for showing proportional data such as the distribution of species by conservation status, with interactive hover effects and percentage calculations.

4. **ComposedChart**: Developed for combining different chart types (lines and bars) in a single visualization, allowing for comparison of related but differently scaled metrics.

Each component was designed with reusability in mind, accepting standardized props for data, styling, and interaction configurations.

### Map Implementation

The map visualization was one of the more complex aspects of Phase 2:

1. **Canada Map Component**: 
   - Implemented using react-simple-maps
   - Added color-coding based on species density by province
   - Created hover tooltips showing basic province data
   - Implemented click interactions to display detailed information

2. **Province Panel**: 
   - Developed a slide-out panel showing detailed province information
   - Included summary statistics (total species, conservation status breakdown)
   - Added bar charts showing status distribution and conservation actions
   - Listed representative species for each province

3. **GeoJSON Integration**:
   - Utilized GeoJSON data from [Mahshadn/canadian_map](https://github.com/Mahshadn/canadian_map) GitHub repository
   - Integrated the data as a local resource to improve reliability and performance
   - Added proper attribution in the References page

### Page-Specific Visualizations

#### HomePage
- Implemented a LineChart showing CSI trends for national, birds, mammals, and fish indices
- Added a stacked BarChart showing species counts by SARA status over time
- Created filtering functionality to view data by taxonomic group

#### FindingsPage
- Added a PieChart showing the current distribution of species by SARA status
- Implemented a BarChart displaying top threats to Canadian species
- Enhanced the key statistics section with visual indicators

#### MapPage
- Implemented the interactive Canada map with province selection
- Created the detailed province information panel with multiple visualizations
- Added a color legend explaining the species density gradient

#### ImportancePage
- Enhanced with a LineChart focusing on population decline trends
- Highlighted key statistics about species decline percentages
- Used visual elements to emphasize the urgency of conservation efforts

## Challenges and Solutions

### 1. External GeoJSON Loading Issues

**Challenge**: Initially, we encountered 429 (Too Many Requests) errors when trying to load the GeoJSON data for the Canadian provinces from an external GitHub URL.

**Solution**: We downloaded the GeoJSON data from the [Mahshadn/canadian_map](https://github.com/Mahshadn/canadian_map) repository and stored it locally in the project's `public/data/geojson` directory. This approach eliminated the dependency on external APIs and improved loading performance.

### 2. TypeScript Type Definitions

**Challenge**: react-simple-maps lacked proper TypeScript definitions for our React 19 environment, causing compilation errors.

**Solution**: Created a custom type declaration file (`src/types/react-simple-maps.d.ts`) to define the interfaces and types needed for the library, enabling proper TypeScript integration.

### 3. Chart Component Flexibility

**Challenge**: Designing chart components that would be flexible enough for different data structures while maintaining type safety.

**Solution**: Used generic interfaces with index signatures to accommodate various data formats, and implemented sensible defaults for optional parameters to simplify component usage.

### 4. Data Aggregation for Visualizations

**Challenge**: Transforming the raw data into appropriate formats for each chart type, especially for the status distribution over time.

**Solution**: Implemented data transformation functions within the components that dynamically process the data based on selected filters and display requirements.

## Project Status and Next Steps

Phase 2 has been successfully completed, with all planned visualizations implemented and functioning correctly. The application now features:

- Interactive charts showing population trends and conservation status
- An interactive map of Canadian provinces with detailed information panels
- Filtering capabilities for different taxonomic groups
- Responsive design for all visualizations
- Proper attribution for all data sources

### Potential Future Enhancements

For future development phases, the following enhancements could be considered:

1. **Advanced Filtering**: Add more filtering options, such as by year ranges, specific provinces, or threat types

2. **Species Detail View**: Implement a detailed view for individual species, showing historical status changes and specific conservation actions

3. **More Advanced Visualizations**: Introduce treemaps for threats, radar charts for conservation actions, or choropleth maps for specific metrics

4. **Animation**: Add timeline animation features to show how species status has changed over the decades

5. **Comparative Analysis**: Create tools to compare data between provinces or taxonomic groups side by side

## Conclusion

Phase 2 has transformed the Canadian Species Data Visualization Web App from a structured shell into a fully interactive, data-rich application. With the implementation of the visualizations, users can now explore and understand the relationships between population trends and conservation status across different taxonomic groups and provinces.

The REcharts and react-simple-maps libraries have proven to be effective tools for creating interactive visualizations, allowing for a rich user experience while maintaining good performance. The component-based architecture has facilitated code reuse and will make future enhancements more straightforward.

This phase represents a significant milestone in the project, delivering on the core functionality of providing meaningful data visualizations for conservation policymakers, researchers, and the interested public.
