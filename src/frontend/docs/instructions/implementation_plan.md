# Implementation Plan: Canadian Species Data Visualization Web App

## 1. Project Overview

**Goal:** Create a web-based interactive data visualization using React to explore the correlation between Canadian vertebrate population trends (Canadian Species Index - CSI) and conservation status (CAN-SAR database) over time (1970-2018). The app will feature a multi-page narrative structure with engaging page transitions.

**Target Audience:** Conservation policymakers, wildlife managers, researchers, students, and the interested public.

**Core Datasets:**
* `canada.csv` (CSI trend data).
* `processed_CAN-SAR_vertebrates_1970-2018.csv` (Detailed species status, location, threats, actions).

**Approach:** Prioritize frontend development using React and REcharts. Data processing will be handled *offline* initially, producing static JSON files consumed by the frontend. This simplifies development and deployment ("No Backend" approach).

## 2. Technology Choices

* **Frontend Framework:** React (using Vite for setup)
* **Charting Library:** REcharts
* **Mapping Library:** React Simple Maps (lightweight, good for choropleths)
* **Page Transitions/Animations:** Framer Motion
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS **`v3.4.17`** (Specific version requested)
* **State Management:** React Context API (sufficient for this scope initially) or Zustand (if complexity increases)
* **Data Preparation (Offline):** Python with Pandas (recommended) or R

## 3. Phase 0: Data Preparation (Offline Pre-processing)

**Goal:** Transform the raw CSI and CAN-SAR data into optimized static JSON files for easy consumption by the React frontend.

**Inputs:**
* `canada.csv` (CSI trend data) [cite: 441]
* User's processed CAN-SAR data (assuming CSV or Excel format)

**Tasks & Tools (Python/Pandas suggested):**
1.  **Load Data:** Read both datasets into dataframes.
2.  **Clean & Standardize:**
    * Ensure consistent column names, data types.
    * Standardize province/territory names for mapping.
    * Filter CAN-SAR data to the 1970-2018 timeframe where applicable.
    * Handle missing values appropriately.
3.  **Aggregate & Structure:**
    * **CSI Trends:** Format `canada.csv` into a simple array of objects: `{ year: 1970, national: 0, birds: 0, mammals: 0, fish: 0 }`.
    * **CAN-SAR Aggregation for Page 1:** Group CAN-SAR data by `year` (or decade), `taxonomic_group` (Bird, Fish, Mammal), and `sara_status`. Count species in each group. Output format: `{ year: 1980, group: 'Birds', status: 'Threatened', count: 5 }`.
    * **CAN-SAR Aggregation for Page 3:** Group CAN-SAR data by `province`. For each province, determine: total species count, counts by status, representative species examples (IDs/names), dominant conservation action types[cite: 231, 326]. Output format: `{ province: 'BC', totalSpecies: 50, endangered: 10, threatened: 25, ..., representativeSpecies: ['Grizzly Bear', 'Orca'], dominantActions: ['Habitat Management', 'Research'] }`.
    * **CAN-SAR Aggregation for Page 4 (Threats):** Group CAN-SAR data by IUCN threat category[cite: 279]. Calculate frequency or aggregate impact scores. Output format: `{ threat: 'Biological Resource Use', count: 150, avgImpact: 3.5 }`.
    * **Full CAN-SAR Details:** Create a main JSON file containing details for individual species needed for lookups or potential drill-downs (ID, name, status history, threats list, actions list, endemism[cite: 286], etc.).
4.  **Export to JSON:** Save the processed dataframes into separate, well-named JSON files in the frontend project's `public` or `src/data` directory.

**Outputs (Static JSON Files):**
* `csi_trends.json`
* `cansar_status_over_time.json`
* `cansar_summary_by_province.json`
* `cansar_threat_summary.json` (or similar based on Page 4 choice)
* `cansar_species_details.json` (optional, for detailed lookups)

## 4. Phase 1: Frontend - Setup & Core Structure

**Goal:** Establish the basic React application shell, navigation, page transitions, and data loading mechanisms.

**Tasks:**
1.  **Initialize Project:** `npm create vite@latest my-dataviz-app --template react-ts` (TypeScript recommended for larger projects).
2.  **Install Dependencies:** `npm install react-router-dom recharts framer-motion react-simple-maps tailwindcss postcss autoprefixer`
3.  **Setup Tailwind:** Follow Tailwind CSS installation guide for Vite.
4.  **Create Core Components:**
    * `Layout.jsx`: Main application wrapper (e.g., header, footer, consistent padding).
    * `PageWrapper.jsx`: Component using `framer-motion` (`motion.div`) to apply transitions to pages.
    * `Navigation.jsx`: Component for the "PPT-style" next/previous page arrows.
5.  **Setup Routing (`App.jsx`):**
    * Use `BrowserRouter`, `Routes`, `Route` from `react-router-dom`.
    * Wrap `Routes` with `AnimatePresence` from `framer-motion` for exit animations.
    * Define routes for each page (`/`, `/findings`, `/map`, `/importance`, `/references`).
6.  **Implement Basic Transitions:** Use simple fades or slides in `PageWrapper.jsx` via `framer-motion`'s `initial`, `animate`, `exit`, and `transition` props.
7.  **Data Loading:**
    * Create a data fetching hook (e.g., `useData`) or use React Context to load the static JSON files on application startup (`useEffect` with `fetch`).
    * Provide loaded data to components via props or context.

## 5. Phase 2: Frontend - Visualizations Implementation

**Goal:** Build the interactive charts and map for each page using the loaded data.

**Tasks (Create components for each page):**
1.  **`HomePage.jsx` (Page 1):**
    * Fetch `csi_trends.json` and `cansar_status_over_time.json`.
    * Implement REcharts `ComposedChart` (or separate `LineChart` + `BarChart`) showing CSI trends and SARA status counts over time.
    * Add `Tooltip`, `Legend`, `XAxis`, `YAxis`. Configure responsiveness.
2.  **`FindingsPage.jsx` (Page 2):**
    * Fetch relevant summary data.
    * Display key numbers using styled text components.
    * Implement REcharts `PieChart` (SARA status distribution) and `BarChart` (Top Threats).
3.  **`MapPage.jsx` (Page 3):**
    * Fetch `cansar_summary_by_province.json`.
    * Obtain or include GeoJSON for Canadian provinces.
    * Implement `react-simple-maps`:
        * Use `ComposableMap`, `Geographies`, `Geography`.
        * Style `Geography` elements based on province data (e.g., color scale for species density).
        * Implement `onMouseEnter`, `onMouseLeave`, `onClick` handlers on `Geography`.
    * Create an `InfoPanel.jsx` component displayed on click, showing province-specific details (stats, representative species, small REcharts bar chart for actions).
4.  **`ImportancePage.jsx` (Page 4):**
    * Fetch necessary aggregated CAN-SAR data (e.g., `cansar_threat_summary.json`).
    * Implement the chosen REcharts visualization (`StackedAreaChart`, `Treemap`, etc.).
    * Add descriptive text to provide context and emotional connection.
5.  **`ReferencesPage.jsx` (Page 5):**
    * Static content: List data sources, acknowledgements, links.

## 6. Phase 3: Frontend - Styling, Refinement & Deployment

**Goal:** Ensure a polished, responsive, and functional application ready for deployment.

**Tasks:**
1.  **Styling:** Apply Tailwind CSS utilities consistently across all components for layout, typography, colors, spacing.
2.  **Responsiveness:** Test and adjust layout/chart configurations for various screen sizes (desktop, tablet, mobile). REcharts `<ResponsiveContainer>` is helpful.
3.  **Interactivity Polish:** Refine tooltips, hover effects, map interactions, and page transitions. Ensure smooth performance.
4.  **Accessibility (A11y):** Add ARIA attributes where necessary, ensure keyboard navigation, check color contrast.
5.  **Testing:**
    * Manual testing across major browsers (Chrome, Firefox, Safari, Edge).
    * Check data accuracy in visualizations.
    * Test navigation and transitions.
6.  **Build:** Run `npm run build` to create optimized production assets.
7.  **Deployment:** Deploy the contents of the `dist` folder to a static web hosting provider (e.g., Netlify, Vercel, GitHub Pages are excellent free options).

## 7. Potential Future Enhancements

* **Backend Introduction:** If data grows very large or complex filtering is needed dynamically, introduce a minimal backend (Node.js/Express or Python/Flask) to serve specific data slices via an API, replacing some static JSON files.
* **Advanced Filtering:** Add UI controls for filtering data (e.g., by specific threat, action type, time range).
* **Detailed Species View:** Allow clicking on species names (e.g., in the map panel) to show a dedicated modal/page with more details from `cansar_species_details.json`.
* **Performance Optimization:** If needed, implement techniques like code splitting or virtualized lists (though likely unnecessary given the scope).