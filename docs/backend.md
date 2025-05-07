# Backend Documentation

## Overview

The backend is built using Python with FastAPI, providing a RESTful API for the frontend application. It handles data processing, storage, and retrieval for the Canadian vertebrate species at risk visualization.

## Project Structure

```
backend/
├── app/
│   ├── api/           # API endpoints
│   ├── core/          # Core functionality
│   ├── models/        # Data models
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
├── tests/            # Test files
└── main.py          # Application entry point
```

## API Endpoints

### Species Data

1. **GET /api/species**
   - Get list of species
   - Query parameters:
     - `region`: Filter by region
     - `status`: Filter by conservation status
     - `year`: Filter by year

2. **GET /api/species/{id}**
   - Get detailed information for a specific species
   - Path parameters:
     - `id`: Species identifier

3. **GET /api/species/{id}/trends**
   - Get population trends for a specific species
   - Path parameters:
     - `id`: Species identifier
   - Query parameters:
     - `start_year`: Start year for trend data
     - `end_year`: End year for trend data

### Regions

1. **GET /api/regions**
   - Get list of regions
   - Query parameters:
     - `type`: Filter by region type

2. **GET /api/regions/{id}/species**
   - Get species in a specific region
   - Path parameters:
     - `id`: Region identifier

## Data Models

### Species

```python
class Species(BaseModel):
    id: str
    name: str
    scientific_name: str
    status: str
    population_trend: str
    region: str
    last_assessment: date
```

### Region

```python
class Region(BaseModel):
    id: str
    name: str
    type: str
    coordinates: List[float]
    species_count: int
```

## Database

The application uses SQLAlchemy with PostgreSQL for data storage:

```python
# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

## Authentication

The API uses JWT tokens for authentication:

```python
# app/core/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Token validation logic
    pass
```

## Error Handling

The application implements consistent error handling:

```python
# app/core/exceptions.py
class APIException(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
```

## Development

### Running the Server

1. Set up environment variables:
```bash
export DATABASE_URL="postgresql://user:password@localhost/dbname"
export SECRET_KEY="your-secret-key"
```

2. Start the server:
```bash
uvicorn main:app --reload
```

### Running Tests

```bash
pytest
```

### Database Migrations

```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Deployment

### Docker

1. Build the image:
```bash
docker build -t species-api .
```

2. Run the container:
```bash
docker run -p 8000:8000 species-api
```

### Cloudflare Workers

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Deploy:
```bash
wrangler publish
```

## Monitoring and Logging

The application uses structured logging:

```python
# app/core/logging.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

## Security Best Practices

1. **Input Validation**
   - Use Pydantic models for request validation
   - Implement rate limiting
   - Sanitize user inputs

2. **Authentication**
   - Use secure password hashing
   - Implement token expiration
   - Use HTTPS only

3. **Data Protection**
   - Encrypt sensitive data
   - Implement proper access controls
   - Regular security audits

## Performance Optimization

1. **Caching**
   - Implement Redis caching
   - Use response caching headers
   - Cache frequently accessed data

2. **Database**
   - Optimize queries
   - Use connection pooling
   - Implement proper indexing

3. **API**
   - Implement pagination
   - Use compression
   - Optimize response payloads 