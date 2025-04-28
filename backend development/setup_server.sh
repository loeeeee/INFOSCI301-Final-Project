#!/bin/bash
# Comprehensive setup script for the Canadian Species Data Visualization backend
# To be run on Ubuntu 24.04 VM at 143.198.213.16

echo "Starting server setup..."

# Update package lists and upgrade existing packages
echo "Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install essential packages
echo "Installing essential packages..."
sudo apt install -y build-essential python3 python3-pip python3-venv git wget curl

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service and enable on boot
echo "Configuring PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database user and database
echo "Setting up PostgreSQL database and user..."
sudo -u postgres psql -c "CREATE USER cansar_user WITH PASSWORD 'cansar_password';"
sudo -u postgres psql -c "CREATE DATABASE cansar_db OWNER cansar_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cansar_db TO cansar_user;"

# Create project directory and setup Python environment
echo "Setting up project directory and virtual environment..."
mkdir -p /home/ubuntu/species-api
cd /home/ubuntu/species-api

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install required Python packages
echo "Installing Python packages..."
pip install Flask Flask-SQLAlchemy Flask-CORS psycopg2-binary pandas python-dotenv gunicorn

echo "Server setup completed successfully!"
echo "Next steps:"
echo "1. Upload your data files (canada.csv and processed_CAN-SAR_vertebrates_1970-2018_async.csv) to /home/ubuntu/species-api/"
echo "2. Run the data processing script: python3 load_data.py"
echo "3. Start the Flask API: sudo systemctl start species-api"

exit 0
