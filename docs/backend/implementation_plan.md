# Implementation Plan: Canadian Species Data Visualization Web App (Flask Backend)

## 1. Project Overview

**Goal:** Create a web-based interactive data visualization using React to explore the correlation between Canadian vertebrate population trends (Canadian Species Index - CSI) and conservation status (CAN-SAR database) over time (1970-2018). The app will feature a multi-page narrative structure with engaging page transitions, powered by a Python/Flask backend API.

**Target Audience:** Conservation policymakers, wildlife managers, researchers, students, and the interested public.

**Core Datasets:**
* `canada.csv` (CSI trend data)[cite: 441].
* `processed_CAN-SAR_vertebrates_1970-2018.csv` (Detailed species status, location, threats, actions).

**Approach:** Develop the Flask backend API first to process, store, and serve the data. The React frontend will then consume this API.

## 2. Technology Choices

* **Backend:** Python, Flask
* **Database:** PostgreSQL
* **Database Client/ORM (Backend):** SQLAlchemy (recommended for structure) or `psycopg2` (direct SQL)
* **Backend Dependencies:** `Flask`, `Flask-SQLAlchemy`, `Flask-CORS`, `psycopg2-binary` (or appropriate DB driver), `pandas`, `python-dotenv`.
* **Frontend Framework:** React (using Vite)
* **Charting Library:** REcharts
* **Mapping Library:** React Simple Maps
* **Page Transitions/Animations:** Framer Motion
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS **`v3.4.17`**
* **API Client (Frontend):** Axios or native Fetch API
* **Data Fetching Hooks (Frontend):** React Query or SWR

## 3. Phase 0: Backend - Database Schema & Data Loading

**Goal:** Set up the PostgreSQL database structure and populate it with the initial CSI and CAN-SAR data.

**Tasks:**
1.  **Install & Setup PostgreSQL:** Ensure PostgreSQL is running. Create a dedicated database.
2.  **Design Database Schema:** Define tables (similar to previous plan, adapted for SQLAlchemy models if used):
    * `Species`: `species_id` (PK), `common_name`, `scientific_name`, `taxonomic_group`, etc.
    * `StatusAssessment`: `assessment_id` (PK), `species_id` (FK), `assessment_year`, `cosewic_status`, `sara_status`, etc.
    * `Threat`: `threat_id` (PK), `assessment_id` (FK), `iucn_threat_code`, `impact`, `scope`, `severity`, `timing`, etc.
    * `Action`: `action_id` (PK), `assessment_id` (FK), `action_type`, `action_subtype`, etc.
    * `Location`: `location_id` (PK), `species_id` (FK), `province_territory`, `eoo`, `iao`, etc.
    * `CsiTrend`: `year` (PK), `national_index`, `birds_index`, `mammals_index`, `fish_index`.
3.  **Create Data Loading Script (Python):**
    * Use `pandas` to read `canada.csv` [cite: 441] and `processed_CAN-SAR_vertebrates_1970-2018.csv`.
    * Use `SQLAlchemy` (or `psycopg2`) to connect to PostgreSQL.
    * Clean and transform data within the pandas DataFrame.
    * Map DataFrame columns to database tables and insert the data. Handle relationships and potential normalization (especially for wide threat data in the CSV).
    * Run the script to populate the database.
4.  **Create Indexes:** Add database indexes on frequently queried columns.

## 4. Phase 1: Backend - API Development (Python/Flask)

**Goal:** Build the Flask API endpoints to serve aggregated and detailed data needed by the frontend visualizations.

**Tasks:**
1.  **Initialize Flask Project:** Set up project structure (e.g., `app.py`, `models.py`, `routes/`, `config.py`). Create a virtual environment (`python -m venv venv`). `pip install Flask Flask-SQLAlchemy Flask-CORS psycopg2-binary pandas python-dotenv`.
2.  **Configuration (`config.py`):** Set up database URI, secret key (if needed), load from `.env` file using `python-dotenv`.
3.  **Database Connection & Models (`app.py` or `models.py`):**
    * Initialize Flask app: `app = Flask(__name__)`.
    * Configure app with database URI.
    * Initialize SQLAlchemy: `db = SQLAlchemy(app)`.
    * Define SQLAlchemy models corresponding to the database tables designed in Phase 0.
4.  **Define API Routes/Blueprints (`routes/` or `app.py`):**
    * Use `@app.route(...)` or Flask Blueprints.
    * `GET /api/csi-trends`: Fetch all data from `CsiTrend` model/table.
    * `GET /api/cansar/status-over-time`: Accepts query parameters (e.g., `?group=Birds`). Use SQLAlchemy (or raw SQL via `db.session.execute`) to query `StatusAssessment`, filter by group (joining with `Species`), group by year/decade and status, and count.
    * `GET /api/cansar/summary/province`: Query `Location` and related tables, group by `province_territory`, aggregate required stats (counts, representative species).
    * `GET /api/cansar/summary/threats`: Query `Threat`, group by `iucn_threat_code`, aggregate frequency/impact.
    * *(Add other endpoints as needed).*
    * Return JSON responses using `jsonify`.
5.  **Middleware/Extensions:**
    * Initialize `Flask-CORS`: `CORS(app)` to handle cross-origin requests from the React frontend.
    * Implement error handling (e.g., using `@app.errorhandler`).
6.  **Testing:** Use tools like Postman, Insomnia, or `curl` to test API endpoints. Consider writing automated tests using `pytest`.

## 5. Phase 2: Frontend - Setup & Core Structure

**Goal:** Establish the React application shell, routing, page transitions, and connect it to the Flask backend API.

**Tasks:**
1.  **Initialize Project:** `npm create vite@latest my-dataviz-app --template react-ts`.
2.  **Install Dependencies:** `npm install react-router-dom recharts framer-motion react-simple-maps axios react-query` (or `swr`), `npm install -D tailwindcss@3.4.17 postcss autoprefixer`.
3.  **Setup Tailwind (`v3.4.17`):** Follow Tailwind CSS installation guide for Vite.
4.  **Create Core Components:** `Layout.jsx`, `PageWrapper.jsx`, `Navigation.jsx`.
5.  **Setup Routing (`App.jsx`):** `BrowserRouter`, `Routes`, `Route`, `AnimatePresence`.
6.  **Implement Basic Transitions:** Use `framer-motion` in `PageWrapper.jsx`.
7.  **API Client Setup:** Configure Axios base URL (pointing to your Flask API).
8.  **Data Fetching:** Use `react-query` or `SWR` to fetch data from the Flask API endpoints.

## 6. Phase 3: Frontend - Visualizations Implementation (Page by Page)

**Goal:** Build the interactive charts and map for each page using data fetched from the Flask API.

**Tasks (Create components for each page, handling loading/error states from API calls):**
1.  **`HomePage.jsx` (Page 1: Trends vs. Status):**
    * Fetch: `/api/csi-trends`, `/api/cansar/status-over-time`.
    * **Visualize:**
        * REcharts `LineChart`: Plot CSI trends (National, Birds, Fish, Mammals) over years[cite: 177].
        * REcharts `StackedBarChart` or `StackedAreaChart`: Show count/proportion of species per SARA status (Endangered, Threatened, Special Concern) grouped by year/decade, potentially filterable by taxonomic group.
    * **Interact:** Tooltips, legends.
2.  **`FindingsPage.jsx` (Page 2: Key Findings):**
    * Fetch: Aggregate data from relevant endpoints (e.g., overall status counts from `/api/cansar/status-over-time`, top threats from `/api/cansar/summary/threats`).
    * **Visualize:**
        * Large Text Displays: Highlight key stats (e.g., % decline in mammals).
        * REcharts `PieChart`: Distribution of species across current SARA statuses.
        * REcharts `BarChart`: Top 5 most common IUCN threat categories[cite: 251, 255].
3.  **`MapPage.jsx` (Page 3: Provincial Overview):**
    * Fetch: `/api/cansar/summary/province`, GeoJSON for Canada (include locally or fetch).
    * **Visualize:**
        * `react-simple-maps` Choropleth: Color provinces based on fetched data (e.g., number of species at risk).
    * **Interact:** On province click, show an `InfoPanel.jsx` containing:
        * Province name.
        * Representative species examples.
        * Small REcharts `BarChart` showing distribution of conservation action types (Outreach, Research, Habitat Mgmt, Population Mgmt) [cite: 231, 326] for that province.
4.  **`ImportancePage.jsx` (Page 4: Affective Element):**
    * Fetch: Data for chosen visualization (e.g., `/api/cansar/status-over-time` for risk trend, `/api/cansar/summary/threats` for threat landscape).
    * **Visualize (Choose one focus):**
        * *Risk Over Time:* REcharts `StackedAreaChart` showing proportion of species in different risk categories over time.
        * *Threat Landscape:* REcharts `Treemap` showing prevalence/impact of IUCN threats.
        * *Focus on Declines:* Enhance the CSI `LineChart` with annotations/callouts.
    * **Narrative:** Add supporting text.
5.  **`ReferencesPage.jsx` (Page 5: References):**
    * **Visualize:** Static text content. List data sources (CSI/ECCC[cite: 1], CAN-SAR [cite: 209]), acknowledgements.

## 7. Phase 4: Styling, Refinement & Deployment

**Goal:** Ensure a polished, responsive, and functional full-stack application ready for deployment.

**Tasks:**
1.  **Styling:** Apply Tailwind CSS (`v3.4.17`) consistently.
2.  **Responsiveness:** Test and adjust frontend layout/charts.
3.  **Interactivity & Performance:** Refine interactions, optimize backend queries if needed.
4.  **Accessibility (A11y):** Review frontend accessibility.
5.  **Testing:** Frontend and Backend testing (manual/automated).
6.  **Build Frontend:** `npm run build`.
7.  **Deployment:**
    * **Backend (Flask):** Deploy using WSGI server (Gunicorn/uWSGI) + potentially Nginx. Options: Heroku, Render, PythonAnywhere, AWS, Google Cloud. Configure environment variables (Database URL, CORS origin, `FLASK_ENV=production`).
    * **Frontend (React):** Deploy static build (Netlify, Vercel, GitHub Pages). Configure API URL via environment variables (`VITE_API_URL`).