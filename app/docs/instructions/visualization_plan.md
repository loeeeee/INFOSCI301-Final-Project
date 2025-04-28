# Visualization Plan (Page by Page)

This document outlines a plan for visualizing data related to population trends and conservation status, structured page by page.

## Page 1: Population Trends vs. Conservation Status

* **Visualization:** Use REcharts `ComposedChart` or combine separate `LineChart` and `BarChart`.
    * **Top:** A `LineChart` showing the CSI trends for Birds, Mammals, and Fish from 1970-2018 (using `canada.csv` data). Include tooltips for specific values.
    * **Bottom (Optional but Recommended for Correlation):** A synchronized `BarChart` or `StackedAreaChart` showing the number/proportion of species from your processed CAN-SAR data within each SARA risk category (Endangered, Threatened, Special Concern) for each group (Birds, Fish, Mammals) over time. This visually links the trend lines above to the underlying conservation status changes.
* **Interactivity:** Tooltips on hover for data points. Allow filtering by taxonomic group.

## Page 2: Key Findings

* **Visualization:** Use a mix of large text displays and simple REcharts.
    * Display key statistics prominently (e.g., "Mammal populations declined by 42% on average between 1970 and 2018").
    * Use REcharts `PieChart` to show the current proportion of listed species in each SARA category (from CAN-SAR).
    * Use REcharts `BarChart` to show the top 5 most common IUCN threat categories across all listed species (from CAN-SAR, see Fig 2c in [reference document if applicable]).
* **Styling:** Use bold typography and contrasting colors to highlight data.

## Page 3: Provincial Conservation Overview (CAN-SAR)

* **Visualization:** Use `react-simple-maps` or `react-leaflet` to create a choropleth map of Canada.
    * Color-code provinces/territories based on data derived from your CAN-SAR dataset (e.g., density of species at risk, number of endemic species, predominant threat type).
* **Interactivity:** On clicking a province/territory:
    * Display an information panel or modal.
    * Inside the panel: Show the name and perhaps an image of a representative species at risk for that region. List key statistics (e.g., # Endangered, # Threatened). Use a small REcharts `BarChart` to show the distribution of conservation action types (Outreach, Research, Habitat Mgmt, Population Mgmt) implemented there, based on your CAN-SAR data. Provide brief context.

## Page 4: The Importance of Conservation (Affective Element)

* **Visualization:** Choose one compelling narrative.
    * **Option A (Risk Over Time):** REcharts `StackedAreaChart` showing the proportion of listed species (from CAN-SAR) in different risk categories (Endangered, Threatened, etc.) over the years (1970-2018). The visual weight shifting towards higher risk categories can be impactful.
    * **Option B (Threat Landscape):** REcharts `Treemap` visualizing the prevalence and calculated impact of different IUCN threats (from CAN-SAR). Larger rectangles represent threats affecting more species or having higher severity/scope.
    * **Option C (Focus on Declines):** Reuse the CSI `LineChart` from Page 1, but use animation or starker colors to draw attention to the significant declines in specific groups like mammals and fish. Add annotations highlighting specific threatened species related to those declines (linking back to CAN-SAR).
* **Narrative:** Accompany the chart with concise text emphasizing the trends and the urgency of conservation efforts.

## Page 5: References & Acknowledgements

* **Visualization:** Static text page.
* **Content:** List data sources (CSI/ECCC, CAN-SAR Database, specific reports if applicable), acknowledgements, and potentially links to relevant organizations.