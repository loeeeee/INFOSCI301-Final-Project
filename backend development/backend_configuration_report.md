# Backend Configuration Report: Canadian Species Data Visualization

## Introduction

This report details the complete backend implementation for the Canadian Species Data Visualization project. The backend is built on a Python/Flask/PostgreSQL stack and provides a RESTful API for the frontend to consume data from the Canadian Species Index (CSI) and Canadian Species at Risk (CAN-SAR) databases.

## System Architecture

### Technology Stack

- **Programming Language**: Python 3
- **Web Framework**: Flask
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Server**: Gunicorn (WSGI HTTP Server)
- **Process Manager**: Systemd
- **Cross-Origin Resource Sharing**: Flask-CORS

### Component Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│  Flask API  │────▶│ PostgreSQL  │
│             │◀────│             │◀────│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │   Gunicorn  │
                    │    WSGI     │
                    └─────────────┘
```

## Database Schema

The database design follows a relational model with the following tables:

1. **Species**: Basic information about each species
   - `species_id` (PK)
   - `common_name`
   - `scientific_name`
   - `taxonomic_group`
   - `endemic_NA` (boolean)
   - `endemic_canada` (boolean)

2. **StatusAssessment**: Conservation status information
   - `assessment_id` (PK)
   - `species_id` (FK to Species)
   - `year`
   - `cosewic_status`
   - `sara_status`
   - `doc_type`

3. **Threat**: Threat information using IUCN threat codes
   - `threat_id` (PK)
   - `assessment_id` (FK to StatusAssessment)
   - `iucn_threat_code`
   - `impact`
   - `scope`
   - `severity`
   - `timing`

4. **Action**: Conservation actions taken
   - `action_id` (PK)
   - `assessment_id` (FK to StatusAssessment)
   - `action_type`
   - `action_subtype`
   - `notes`

5. **Location**: Geographic distribution
   - `location_id` (PK)
   - `species_id` (FK to Species)
   - `province_territory`
   - `eoo` (extent of occurrence)
   - `iao` (index of area of occupancy)

6. **CsiTrend**: Time-series data from the Canadian Species Index
   - `year` (PK)
   - `national_index`
   - `birds_index`
   - `mammals_index`
   - `fish_index`
   - `number_species`
   - `number_bird_species`
   - `number_mammal_species`
   - `number_fish_species`

## API Endpoints

The backend provides the following API endpoints:

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/csi-trends` | GET | Retrieves all CSI trend data | None |
| `/api/cansar/status-over-time` | GET | Species status counts over time | `group` (optional): Filter by taxonomic group |
| `/api/cansar/summary/province` | GET | Summary of species by province | None |
| `/api/cansar/summary/threats` | GET | Summary of threats by IUCN code | None |
| `/api/cansar/summary/actions` | GET | Summary of conservation actions | None |

## Data Processing

The data loading process handles two primary datasets:

1. **CSI Data** (`canada.csv`): Relatively small dataset loaded in its entirety
   - Cleaned and transformed into the `CsiTrend` table
   - Contains time-series data from 1970 to 2018

2. **CAN-SAR Data** (`processed_CAN-SAR_vertebrates_1970-2018_async.csv`): Large dataset loaded in chunks
   - Processed into multiple related tables (Species, StatusAssessment, Threat, Action, Location)
   - Options for loading partial data for testing

## Deployment

The backend is deployed on an Ubuntu 24.04 server (IP: 143.198.213.16) using the following components:

1. **Gunicorn**: WSGI HTTP server that runs the Flask application
2. **Systemd**: Process manager for starting, stopping, and monitoring the API service
3. **PostgreSQL**: Database server running locally

The deployment process includes:
- Server environment setup
- PostgreSQL installation and configuration
- Database initialization and data loading
- Service configuration for automatic startup and recovery

## Security Considerations

While security requirements were intentionally kept minimal, the implementation includes:

1. **CORS Support**: Configured to allow requests from any origin, suitable for development
2. **Error Handling**: Proper error responses with descriptive messages
3. **Firewall Configuration**: Optional steps in the deployment guide to configure UFW
4. **Database Authentication**: PostgreSQL user with password authentication

## Scalability

The implementation includes several features for potential scalability:

1. **Chunked Data Processing**: Large dataset is processed in chunks to manage memory usage
2. **Database Indexing**: Primary and foreign keys are automatically indexed by SQLAlchemy
3. **Multiple Gunicorn Workers**: The service is configured with multiple worker processes
4. **Batch Database Commits**: Records are committed in batches to improve performance

## Frontend Integration

The frontend can integrate with this backend by making HTTP requests to the provided API endpoints. The API returns JSON data that can be directly consumed by JavaScript frameworks like React (as specified in the implementation plan).

Complete code examples for frontend integration are provided in the API documentation.

## Maintenance & Monitoring

For ongoing maintenance and monitoring:

1. **Logs**: Available through systemd (`journalctl -u species-api`)
2. **Service Management**: Start/stop/restart using systemctl commands
3. **Database Maintenance**: Standard PostgreSQL maintenance procedures apply
4. **Performance Monitoring**: Consider adding metrics collection if needed in the future

## Future Improvements

Potential enhancements for future iterations:

1. **Authentication**: Add JWT or API key authentication if public access is required
2. **Caching**: Implement Redis or in-memory caching for frequently accessed data
3. **Rate Limiting**: Add rate limiting for public-facing deployments
4. **Pagination**: Add pagination support for large result sets
5. **Advanced Filtering**: Expand query parameters for more flexible data filtering
6. **Full-text Search**: Add search capabilities across species and assessment data

## Conclusion

The backend implementation provides a solid foundation for the Canadian Species Data Visualization project. It efficiently manages and serves the complex species data through a RESTful API that the frontend can easily consume. The system is designed with simplicity in mind while remaining flexible enough to accommodate future enhancements as requirements evolve.
