# CAN-SAR Data Processing to Fit Canadian Species Index's Time Frame and Categorization

**Purpose:**

This script processes the `CAN-SAR_database.csv` file to extract and categorize information about vertebrate species (birds, mammals, fish) assessed within a specific timeframe (1970-2018).

**Processing Principles:**

1.  **Loading:** Loads the `CAN-SAR_database.csv` file, attempting UTF-8 encoding first, then falling back to Latin-1 if needed.
2.  **Year Filtering:** Filters the records based on the `year_published` column to include only assessments published between 1970 and 2018 (inclusive).
3.  **AI Categorization:** Uses the species' `common_name` and an external AI model via the OpenRouter API to classify each unique species into 'bird', 'mammal', 'fish', or 'other'.
    * **Efficiency:** API calls are made concurrently in batches using Python's `asyncio` library to speed up processing for large datasets.
    * **Robustness:** Includes refined prompts and error handling to manage potential API issues or unexpected model responses.
4.  **Category Filtering:** Filters the dataset again to retain only the records categorized as 'bird', 'mammal', or 'fish'.
5.  **Output:** Saves the final filtered and categorized data to a new CSV file (`processed_CAN-SAR_vertebrates_1970-2018_async.csv`).

**Setup:**

1.  **Prerequisites:**
    * Python 3.7+ installed.
    * The `CAN-SAR_database.csv` file.

2.  **Create Virtual Environment:**
    * Open your terminal or command prompt in the project directory.
    * Create a virtual environment (named `.venv` here, but can be any name):
        ```bash
        python -m venv .venv
        ```
    * Activate the virtual environment:
        * **Windows (Command Prompt/PowerShell):**
            ```bash
            .\.venv\Scripts\activate
            ```
        * **macOS/Linux (Bash/Zsh):**
            ```bash
            source .venv/bin/activate
            ```
        *(You should see `(.venv)` at the beginning of your terminal prompt)*

3.  **Install Packages:**
    * Install the required packages using pip:
        ```bash
        pip install -r requirements.txt
        ```

4.  **Set Up API Key (.env file):**
    * Create a file named `.env` (note the leading dot) in the project directory.
    * Add your OpenRouter API key to this file like so:
        ```
        OPENROUTER_API_KEY='your-openrouter-key-here'
        ```
        *(Replace `your-openrouter-key-here` with your actual key)*

**Running the Script:**

1.  Ensure your virtual environment is active.
2.  Make sure the `CAN-SAR_database.csv` file and your `.env` file are in the same directory as the Python script (e.g., `process_cansar.py`).
3.  Run the script from your terminal:
    ```bash
    python data_process.py
    ```
4.  The script will print progress updates to the console. API calls may take some time depending on the number of unique species and API responsiveness.

**Output:**

* A new CSV file named `processed_CAN-SAR_vertebrates_1970-2018_async.csv` will be created in the same directory, containing the filtered and categorized data.