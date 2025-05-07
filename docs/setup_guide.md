# Setup Guide

This guide provides detailed instructions for setting up and running the Canadian Vertebrate Species at Risk visualization project.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Git
- npm or yarn package manager

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/INFOSCI301-Final-Project.git
cd INFOSCI301-Final-Project
```

### 2. Frontend Setup

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
# or if using yarn
yarn install
```

3. Create a `.env` file in the app directory with the following variables:
```env
VITE_API_URL=http://localhost:8787
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173`

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python main.py
```

The backend API will be available at `http://localhost:8787`

### 4. Data Processing Setup

1. Navigate to the data processing directory:
```bash
cd data\ processing
```

2. Create a Python virtual environment (if not already created):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the data processing script:
```bash
python data_process.py
```

## Example Usage

### Running the Visualization

1. Start both the frontend and backend servers as described above
2. Open your browser and navigate to `http://localhost:5173`
3. Use the interactive dashboard to explore the data

### Processing New Data

1. Place your raw data files in the `data processing/raw_data` directory
2. Update the configuration in `data_process.py` if needed
3. Run the processing script:
```bash
python data_process.py
```

### Development Workflow

1. Make changes to the frontend code in the `app/src` directory
2. Changes will be automatically reflected in the development server
3. For backend changes, restart the backend server after modifications

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - If port 5173 is in use, the frontend will automatically try the next available port
   - If port 8787 is in use, modify the port in the backend configuration

2. **Dependency Issues**
   - Clear node_modules and reinstall:
     ```bash
     rm -rf node_modules
     npm install
     ```
   - Update Python dependencies:
     ```bash
     pip install --upgrade -r requirements.txt
     ```

3. **Data Processing Errors**
   - Ensure all required data files are present in the correct directories
   - Check file permissions
   - Verify Python environment is activated

## Additional Resources

- [Frontend Documentation](./frontend.md)
- [Backend Documentation](./backend.md)
- [Data Processing Documentation](./data_processing.md)
- [API Documentation](./api.md) 