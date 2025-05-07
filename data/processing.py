import pandas as pd
import os                 # For accessing environment variables and paths
import asyncio            # For running API calls concurrently
from dotenv import load_dotenv # To load variables from .env file
from openai import AsyncOpenAI # Use the Async client

# --- Load Environment Variables ---
load_dotenv()
print("Attempting to load environment variables from .env file...")

# --- Configuration ---
csv_file_path = 'data/CAN-SAR_database.csv'
year_column = 'year_published'
species_column = 'common_name' # Using common_name as requested
min_year = 1970
max_year = 2018
target_categories = ['bird', 'mammal', 'fish']
# Define the output filename
output_csv_file = 'data/processed_CAN-SAR_vertebrates_1970-2018_async.csv'
batch_size = 50
delay_between_batches = 2 # Seconds to wait between batches
openrouter_model = "openai/gpt-4.1" 

# --- OpenRouter API Setup ---
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
async_client = None # Initialize async client variable

if not openrouter_api_key:
    print("Error: OPENROUTER_API_KEY not found in environment variables or .env file.")
else:
    try:
        async_client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=openrouter_api_key,
        )
        print(f"OpenRouter Async client initialized for model: {openrouter_model}")
    except Exception as e:
        print(f"Error initializing OpenRouter Async client: {e}")
        # Keep async_client as None

# --- Async Function for OpenRouter Categorization ---
async def async_get_species_category(species_name, client, model_name):
    """
    (Async) Uses OpenRouter API to classify species. Includes refined prompt and error handling.
    """
    if not client:
        return species_name, 'error'

    if pd.isna(species_name) or not isinstance(species_name, str) or not species_name.strip():
        return species_name, 'other'

    # Refined prompt - Added instruction not to return empty string
    prompt = f"""Analyze the following species common name. Classify it into ONLY one of the following categories: 'bird', 'mammal', 'fish', or 'other'.
- If the name clearly refers to a bird, mammal, or fish, return that category.
- If the name refers to a plant, insect, amphibian, reptile, fungus, or any other non-target organism, return 'other'.
- If the classification is ambiguous or unclear from the name alone, return 'other'.
Respond with ONLY the single category name ('bird', 'mammal', 'fish', or 'other'). Your response must be one of these four category names only and never an empty string. Do not add any explanation.

Species: {species_name}
Category:"""

    try:
        response = await client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=10,
            temperature=0.1 # Low temperature for consistent classification
        )

        # Improved response handling
        category = '' # Default to empty string
        if response.choices and len(response.choices) > 0:
            message = response.choices[0].message
            if message and message.content:
                # Clean the response: lowercase, strip whitespace, remove punctuation
                category = message.content.strip().lower()
                category = ''.join(c for c in category if c.isalnum())

        valid_categories = ['bird', 'mammal', 'fish', 'other']
        if category in valid_categories:
            return species_name, category
        # Check if the *uncleaned* response contains a valid category if the cleaned one didn't match
        elif response.choices and response.choices[0].message and response.choices[0].message.content:
             raw_category_text = response.choices[0].message.content.strip().lower()
             cleaned_category = next((cat for cat in valid_categories if cat in raw_category_text), None)
             if cleaned_category:
                 print(f"Info: Cleaned potentially noisy classification '{raw_category_text}' to '{cleaned_category}' for '{species_name}'.")
                 return species_name, cleaned_category

        # If still no valid category found, default to 'other'
        print(f"Warning: Could not extract valid category from response '{category}' for '{species_name}'. Defaulting to 'other'.")
        return species_name, 'other'

    except Exception as e:
        print(f"Error during API call for '{species_name}': {e}. Defaulting to 'other'.")
        return species_name, 'other'

# --- Main Asynchronous Processing Function ---
async def process_data_async(df_filtered, client, model_name):
    """Handles the asynchronous categorization and final filtering."""

    if df_filtered.empty:
        print("Input DataFrame is empty, skipping categorization.")
        return pd.DataFrame()

    if not client:
        print("OpenRouter client not available, skipping categorization.")
        return df_filtered # Return only year-filtered data

    print(f"\nCategorizing species using OpenRouter (Model: {model_name}, Batch Size: {batch_size})...")
    unique_species = df_filtered[species_column].dropna().unique()
    print(f"Found {len(unique_species)} unique species names to categorize.")

    species_category_map = {}
    processed_count = 0

    for i in range(0, len(unique_species), batch_size):
        batch_species_names = unique_species[i : i + batch_size]
        print(f"Processing async batch {i // batch_size + 1} ({len(batch_species_names)} species)...")

        tasks = [async_get_species_category(name, client, model_name) for name in batch_species_names]
        results = await asyncio.gather(*tasks, return_exceptions=True) # Capture potential exceptions from tasks

        # Process results, checking for exceptions
        for idx, result in enumerate(results):
            species_name = batch_species_names[idx] # Get corresponding name
            if isinstance(result, Exception):
                print(f"  Task for '{species_name}' failed with exception: {result}. Assigning 'error'.")
                species_category_map[species_name] = 'error'
            else:
                # Result should be a tuple (name, category)
                name, category = result
                species_category_map[name] = category
            processed_count += 1

        print(f"  Batch {i // batch_size + 1} complete. Processed {processed_count} / {len(unique_species)} unique species.")

        if i + batch_size < len(unique_species):
             print(f"  Waiting {delay_between_batches} seconds before next batch...")
             await asyncio.sleep(delay_between_batches)

    print(f"Finished categorizing all {len(unique_species)} unique species.")

    print("Mapping categories back to the DataFrame...")
    df_result = df_filtered.copy()
    df_result['Category'] = df_result[species_column].map(species_category_map)
    df_result['Category'].fillna('other', inplace=True) # Handle NaNs or species missed

    print("\nCategory column added. Value counts:")
    print(df_result['Category'].value_counts())

    print(f"\nFiltering data to include only categories: {target_categories}...")
    df_final = df_result[df_result['Category'].isin(target_categories)].copy()
    print(f"Final data shape after category filtering: {df_final.shape}")

    return df_final


# --- Main Execution Block ---
if __name__ == "__main__":
    df_final_result = pd.DataFrame()
    try:
        # 1. Load the dataset
        print(f"Loading data from '{csv_file_path}'...")
        try:
            df = pd.read_csv(csv_file_path, low_memory=False)
            print("Successfully loaded with UTF-8 encoding.")
        except UnicodeDecodeError:
            print("UTF-8 decoding failed. Trying 'latin1' encoding...")
            df = pd.read_csv(csv_file_path, low_memory=False, encoding='latin1')
            print("Successfully loaded with 'latin1' encoding.")
        print(f"Loaded {len(df)} rows.")

        # Verify required columns exist
        if year_column not in df.columns:
            raise ValueError(f"Error: Year column '{year_column}' not found.")
        if species_column not in df.columns:
            raise ValueError(f"Error: Species column '{species_column}' not found.")

        # 2. Filter by Year
        print(f"\nFiltering data for years {min_year}-{max_year} based on '{year_column}'...")
        df[year_column] = pd.to_numeric(df[year_column], errors='coerce')
        df_year_filtered = df.dropna(subset=[year_column])
        df_year_filtered = df_year_filtered[df_year_filtered[year_column].astype(int).between(min_year, max_year)].copy()
        df_year_filtered[year_column] = df_year_filtered[year_column].astype(int)
        print(f"Data shape after year filtering: {df_year_filtered.shape}")

        # 3. Run Asynchronous Processing
        if async_client:
             df_final_result = asyncio.run(process_data_async(df_year_filtered, async_client, openrouter_model))
        else:
             print("\nSkipping categorization and final filtering as OpenRouter client failed to initialize.")
             df_final_result = df_year_filtered

    except FileNotFoundError:
        print(f"Error: The file '{csv_file_path}' was not found.")
    except ValueError as ve:
        print(ve)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    # --- Output Final Results ---
    if not df_final_result.empty:
        print("\n--- Processing Complete ---")
        print("First 5 rows of the final processed data:")
        print(df_final_result.head().to_markdown(index=False, numalign="left", stralign="left"))

        # --- Save the final DataFrame ---
        try:
            # Construct path relative to the script's directory
            output_path = os.path.join(os.getcwd(), output_csv_file)
            # Save to CSV, ensuring UTF-8 encoding for compatibility
            df_final_result.to_csv(output_path, index=False, encoding='utf-8')
            print(f"\nFinal processed data saved to '{output_path}'")
        except Exception as e:
            print(f"\nError saving file to '{output_path}': {e}")
            print("Please check directory permissions and available disk space.")
        # --- End Save Section ---

    else:
        print("\n--- Processing Complete ---")
        print("The final DataFrame is empty. No data matched all filtering criteria or processing failed.")