# Data Processing Documentation

## Overview

The data processing pipeline handles the transformation and analysis of Canadian vertebrate species at risk data. It processes raw data from multiple sources and prepares it for visualization in the frontend application.

## Data Sources

1. **CAN-SAR Database**
   - Source: Canadian Species at Risk Database
   - Format: CSV
   - Location: `data processing/raw_data/CAN-SAR_database.csv`

2. **Canadian Species Index**
   - Source: Canadian Wildlife Service
   - Format: CSV
   - Location: `data processing/raw_data/CSI_data.csv`

## Processing Pipeline

### 1. Data Cleaning

```python
# data_processing/clean_data.py
def clean_species_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and standardize species data
    """
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Standardize column names
    df.columns = [col.lower().replace(' ', '_') for col in df.columns]
    
    # Handle missing values
    df = df.fillna({
        'population_trend': 'Unknown',
        'region': 'Unspecified'
    })
    
    return df
```

### 2. Data Transformation

```python
# data_processing/transform_data.py
def transform_species_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transform species data for visualization
    """
    # Convert dates
    df['last_assessment'] = pd.to_datetime(df['last_assessment'])
    
    # Calculate derived metrics
    df['years_since_assessment'] = (
        pd.Timestamp.now() - df['last_assessment']
    ).dt.days / 365
    
    return df
```

### 3. Data Integration

```python
# data_processing/integrate_data.py
def integrate_datasets(
    can_sar_df: pd.DataFrame,
    csi_df: pd.DataFrame
) -> pd.DataFrame:
    """
    Integrate CAN-SAR and CSI datasets
    """
    # Merge datasets
    merged_df = pd.merge(
        can_sar_df,
        csi_df,
        on='species_id',
        how='left'
    )
    
    return merged_df
```

## Output Formats

### 1. Processed Species Data

```json
{
  "species_id": "string",
  "name": "string",
  "scientific_name": "string",
  "status": "string",
  "population_trend": "string",
  "region": "string",
  "last_assessment": "date",
  "years_since_assessment": "float"
}
```

### 2. Trend Data

```json
{
  "species_id": "string",
  "year": "integer",
  "population_index": "float",
  "confidence_interval": {
    "lower": "float",
    "upper": "float"
  }
}
```

## Usage

### Running the Pipeline

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the processing script:
```bash
python data_process.py
```

### Configuration

The pipeline can be configured through `config.yaml`:

```yaml
data_processing:
  input_path: "raw_data"
  output_path: "processed_data"
  log_level: "INFO"
  
  cleaning:
    remove_duplicates: true
    fill_missing: true
    
  transformation:
    date_format: "%Y-%m-%d"
    derived_metrics: true
```

## Data Quality Checks

### 1. Validation

```python
# data_processing/validation.py
def validate_data(df: pd.DataFrame) -> bool:
    """
    Validate processed data
    """
    # Check required columns
    required_columns = [
        'species_id',
        'name',
        'status',
        'region'
    ]
    
    if not all(col in df.columns for col in required_columns):
        return False
    
    # Check data types
    if not df['species_id'].dtype == 'object':
        return False
    
    return True
```

### 2. Quality Metrics

```python
# data_processing/quality.py
def calculate_quality_metrics(df: pd.DataFrame) -> dict:
    """
    Calculate data quality metrics
    """
    metrics = {
        'completeness': df.notna().mean().to_dict(),
        'uniqueness': df.nunique().to_dict(),
        'consistency': check_data_consistency(df)
    }
    
    return metrics
```

## Error Handling

The pipeline implements robust error handling:

```python
# data_processing/error_handling.py
class DataProcessingError(Exception):
    """Custom exception for data processing errors"""
    pass

def handle_processing_error(error: Exception):
    """
    Handle processing errors
    """
    logging.error(f"Error processing data: {str(error)}")
    # Implement error recovery logic
```

## Performance Optimization

### 1. Parallel Processing

```python
# data_processing/parallel.py
from concurrent.futures import ProcessPoolExecutor

def process_in_parallel(data_chunks: List[pd.DataFrame]) -> pd.DataFrame:
    """
    Process data chunks in parallel
    """
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(process_chunk, data_chunks))
    
    return pd.concat(results)
```

### 2. Memory Management

```python
# data_processing/memory.py
def optimize_memory_usage(df: pd.DataFrame) -> pd.DataFrame:
    """
    Optimize DataFrame memory usage
    """
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].astype('category')
    
    return df
```

## Monitoring and Logging

The pipeline uses structured logging:

```python
# data_processing/logging.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data_processing.log'),
        logging.StreamHandler()
    ]
)
```

## Best Practices

1. **Data Quality**
   - Validate input data
   - Implement data quality checks
   - Document data transformations

2. **Performance**
   - Use parallel processing for large datasets
   - Optimize memory usage
   - Implement caching where appropriate

3. **Maintainability**
   - Write modular code
   - Document functions and classes
   - Implement proper error handling 