import pandas as pd
import numpy as np
from sqlalchemy import create_engine, text
from app import db, Species, StatusAssessment, Threat, Action, Location, CsiTrend
import sys
import os
import time

def load_csi_data(file_path):
    """Load data from canada.csv into CsiTrend table"""
    print(f"Loading CSI data from {file_path}...")
    
    try:
        # Read the CSV file, skipping the footer notes
        df = pd.read_csv(file_path, skipfooter=3, engine='python')
        
        # Clean data (remove empty rows, handle NaN values)
        df = df.dropna(how='all')
        
        # Insert into database
        print(f"Inserting {len(df)} CSI trend records...")
        count = 0
        
        for _, row in df.iterrows():
            try:
                trend = CsiTrend(
                    year=int(row['Year']),
                    national_index=row['National index (cumulative percentage change since 1970)'],
                    birds_index=row['Birds index (cumulative percentage change since 1970)'],
                    mammals_index=row['Mammals index (cumulative percentage change since 1970)'],
                    fish_index=row['Fish index (cumulative percentage change since 1970)'],
                    number_species=row['Number of species'],
                    number_bird_species=row['Number of bird species'],
                    number_mammal_species=row['Number of mammal species'],
                    number_fish_species=row['Number of fish species']
                )
                db.session.add(trend)
                count += 1
                
                # Commit in batches to avoid memory issues
                if count % 10 == 0:
                    db.session.commit()
                    print(f"  Processed {count} records...")
                    
            except Exception as e:
                print(f"Error inserting CSI record for year {row['Year']}: {str(e)}")
                db.session.rollback()
        
        # Final commit
        db.session.commit()
        print(f"Successfully loaded {count} CSI trend records.")
        
    except Exception as e:
        print(f"Error loading CSI data: {str(e)}")
        db.session.rollback()


def load_cansar_data(file_path, max_records=None):
    """
    Load data from processed_CAN-SAR_vertebrates_1970-2018_async.csv
    
    Args:
        file_path: Path to the CAN-SAR CSV file
        max_records: Maximum number of records to process (None for all)
    """
    print(f"Loading CAN-SAR data from {file_path}...")
    print(f"Processing {'all' if max_records is None else max_records} records...")
    
    try:
        # Use chunksize to handle the large file
        chunk_size = 100
        processed_records = 0
        record_count = {'species': 0, 'assessments': 0, 'locations': 0, 'threats': 0, 'actions': 0}
        species_ids = set()  # Track processed species IDs
        
        # Process the file in chunks to handle its large size
        for chunk_num, chunk in enumerate(pd.read_csv(file_path, sep='\t', chunksize=chunk_size)):
            print(f"Processing chunk {chunk_num + 1}...")
            
            # Process each row in the chunk
            for _, row in chunk.iterrows():
                try:
                    # Check if we've reached the maximum records
                    if max_records is not None and processed_records >= max_records:
                        break
                    
                    processed_records += 1
                    species_id = row['speciesID'] if not pd.isna(row['speciesID']) else None
                    
                    # Skip rows without a valid species ID
                    if species_id is None:
                        continue
                    
                    # Check if species already exists
                    if species_id not in species_ids:
                        species = Species(
                            species_id=species_id,
                            common_name=row['common_name'] if not pd.isna(row['common_name']) else None,
                            scientific_name=row['species'] if not pd.isna(row['species']) else None,
                            taxonomic_group=row['taxonomic_group'] if not pd.isna(row['taxonomic_group']) else None,
                            endemic_NA=bool(row['endemic_NA']) if not pd.isna(row['endemic_NA']) else False,
                            endemic_canada=bool(row['endemic_canada']) if not pd.isna(row['endemic_canada']) else False
                        )
                        db.session.add(species)
                        species_ids.add(species_id)
                        record_count['species'] += 1
                    
                    # Add assessment
                    assessment = StatusAssessment(
                        species_id=species_id,
                        year=int(row['year_published']) if not pd.isna(row['year_published']) else None,
                        cosewic_status=row['cosewic_status'] if not pd.isna(row['cosewic_status']) else None,
                        sara_status=row['sara_status'] if not pd.isna(row['sara_status']) else None,
                        doc_type=row['doc_type'] if not pd.isna(row['doc_type']) else None
                    )
                    db.session.add(assessment)
                    record_count['assessments'] += 1
                    db.session.flush()  # Get the ID
                    
                    # Add locations
                    if not pd.isna(row['ranges']):
                        for province in str(row['ranges']).split():
                            location = Location(
                                species_id=species_id,
                                province_territory=province,
                                eoo=float(row['EOO']) if not pd.isna(row['EOO']) else None,
                                iao=float(row['IAO']) if not pd.isna(row['IAO']) else None
                            )
                            db.session.add(location)
                            record_count['locations'] += 1
                    
                    # Add threat data
                    # Process major threat categories (X1 through X11)
                    for i in range(1, 12):
                        threat_code = f'X{i}'
                        threat_identified_col = f'{threat_code}_threat_identified'
                        
                        if threat_identified_col in row and not pd.isna(row[threat_identified_col]) and row[threat_identified_col] == 1:
                            impact = row.get(f'{threat_code}_iucn_impact')
                            scope = row.get(f'{threat_code}_iucn_scope')
                            severity = row.get(f'{threat_code}_iucn_severity')
                            timing = row.get(f'{threat_code}_iucn_timing')
                            
                            threat = Threat(
                                assessment_id=assessment.assessment_id,
                                iucn_threat_code=threat_code,
                                impact=str(impact) if not pd.isna(impact) else None,
                                scope=str(scope) if not pd.isna(scope) else None,
                                severity=str(severity) if not pd.isna(severity) else None,
                                timing=str(timing) if not pd.isna(timing) else None
                            )
                            db.session.add(threat)
                            record_count['threats'] += 1
                    
                    # Add action data
                    if 'action_type' in row and not pd.isna(row['action_type']):
                        action = Action(
                            assessment_id=assessment.assessment_id,
                            action_type=row['action_type'],
                            action_subtype=row['action_subtype'] if not pd.isna(row['action_subtype']) else None,
                            notes=row['notes_action_subtype'] if not pd.isna(row['notes_action_subtype']) else None
                        )
                        db.session.add(action)
                        record_count['actions'] += 1
                
                except Exception as e:
                    print(f"Error processing row {processed_records}: {str(e)}")
                    continue
            
            # Commit after each chunk
            db.session.commit()
            print(f"  Processed {processed_records} records so far...")
            
            # Exit loop if we've reached max_records
            if max_records is not None and processed_records >= max_records:
                break
        
        print("CAN-SAR data loading completed.")
        print(f"Inserted records:")
        print(f"  Species: {record_count['species']}")
        print(f"  Status Assessments: {record_count['assessments']}")
        print(f"  Locations: {record_count['locations']}")
        print(f"  Threats: {record_count['threats']}")
        print(f"  Actions: {record_count['actions']}")
        
    except Exception as e:
        print(f"Error loading CAN-SAR data: {str(e)}")
        db.session.rollback()


def main():
    """Main function to load all data"""
    start_time = time.time()
    
    # Create all tables
    print("Creating database tables...")
    db.create_all()
    
    # Load CSI data
    csi_file = 'data/canada.csv'
    if os.path.exists(csi_file):
        load_csi_data(csi_file)
    else:
        print(f"Error: {csi_file} not found")
    
    # Load CAN-SAR data
    cansar_file = 'data/processed_CAN-SAR_vertebrates_1970-2018_async.csv'
    if os.path.exists(cansar_file):
        # Ask for max records to process
        max_records = input("Enter maximum number of CAN-SAR records to process (or 'all' for all records): ")
        if max_records.lower() == 'all':
            max_records = None
        else:
            try:
                max_records = int(max_records)
            except ValueError:
                print("Invalid input. Processing 1000 records by default.")
                max_records = 1000
        
        load_cansar_data(cansar_file, max_records)
    else:
        print(f"Error: {cansar_file} not found")
    
    elapsed_time = time.time() - start_time
    print(f"Total processing time: {elapsed_time:.2f} seconds")


if __name__ == "__main__":
    main()
