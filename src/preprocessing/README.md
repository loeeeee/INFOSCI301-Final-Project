# Data Processing Pipeline

This directory contains the data processing scripts and utilities for the Canadian Vertebrate Species at Risk project. The main script processes the CAN-SAR database to categorize and analyze vertebrate species data.

## Overview

The data processing pipeline performs the following tasks:
1. Loads and validates the CAN-SAR database
2. Filters records by year (1970-2018)
3. Categorizes species into birds, mammals, and fish using OpenRouter API
4. Generates a processed dataset with species categories

## Files

- `data_process.py`: Main data processing script
- `requirements.txt`: Python dependencies
- Input/Output files:
  - Input: `CAN-SAR_database.csv` (located in `/data` directory)
  - Output: `processed_CAN-SAR_vertebrates_1970-2018_async.csv` (saved to `/data` directory)

## Dependencies

The script requires the following Python packages:
- `pandas>=2.0.0`: For data manipulation and analysis
- `python-dotenv>=1.0.0`: For loading environment variables
- `openai>=1.0.0`: For OpenRouter API integration
- `tabulate>=0.9.0`: For pretty-printing DataFrames

## Setup

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the project root with your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

## Usage

Run the data processing script:
```bash
python data_process.py
```

### Script Behavior

The script will:
1. Load the CAN-SAR database from the `/data` directory
2. Filter records to include only years 1970-2018
3. Process species names in batches of 50 using OpenRouter API
4. Categorize species into:
   - Birds
   - Mammals
   - Fish
   - Other (non-target species)
5. Save the processed data to `/data/processed_CAN-SAR_vertebrates_1970-2018_async.csv`

### Features

- **Asynchronous Processing**: Uses Python's `asyncio` for efficient API calls
- **Batch Processing**: Processes species in batches to manage API rate limits
- **Error Handling**: Robust error handling for API calls and data processing
- **Progress Tracking**: Displays progress information during processing
- **Data Validation**: Validates input data and required columns

### Output Format

The processed CSV file contains all original columns plus:
- `Category`: The species category (bird, mammal, fish, or other)
- Filtered to include only vertebrate species (birds, mammals, fish)

## Error Handling

The script includes error handling for:
- Missing or invalid input files
- API connection issues
- Invalid species names
- Missing required columns
- Data type conversion errors

## Notes

- The script uses OpenRouter API for species categorization
- Processing time depends on the number of unique species and API response times
- A delay of 2 seconds is added between batches to respect API rate limits
- The script will create the output file in the `/data` directory

## Troubleshooting

Common issues and solutions:
1. **API Key Error**: Ensure your `.env` file contains a valid OpenRouter API key
2. **File Not Found**: Verify that `CAN-SAR_database.csv` exists in the `/data` directory
3. **Permission Error**: Check write permissions in the `/data` directory
4. **API Rate Limits**: If hitting rate limits, increase the `delay_between_batches` value

## Contributing

When modifying the script:
1. Maintain the existing error handling
2. Keep the batch processing approach
3. Update the documentation for any new features
4. Test with a small dataset before processing the full database