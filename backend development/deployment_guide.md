# Deployment Guide for Canadian Species Data Visualization Backend

This guide provides step-by-step instructions for deploying the backend API on your Ubuntu 24.04 server (143.198.213.16).

## 1. Connecting to Your Server

First, connect to your server using SSH:

```bash
ssh ubuntu@143.198.213.16
```

You'll need to enter your password or use SSH key authentication.

## 2. Transferring Files to the Server

### Option 1: Using SCP (from your local machine)

Transfer all the project files from your local machine to the server:

```bash
# From your local machine, in the directory with the project files
scp setup_server.sh app.py load_data.py wsgi.py species-api.service canada.csv processed_CAN-SAR_vertebrates_1970-2018_async.csv ubuntu@143.198.213.16:/home/ubuntu/
```

### Option 2: Downloading Files Directly on the Server

```bash
# On the server
mkdir -p /home/ubuntu/species-api
cd /home/ubuntu/species-api

# Create each file (you'll need to copy-paste the content)
nano setup_server.sh  # Paste content and save (Ctrl+O, Enter, Ctrl+X)
nano app.py           # Paste content and save
nano load_data.py     # Paste content and save
nano wsgi.py          # Paste content and save
nano species-api.service  # Paste content and save

# Download the data files if they're available via URL
# For example:
# wget https://your-url/canada.csv
# wget https://your-url/processed_CAN-SAR_vertebrates_1970-2018_async.csv
```

## 3. Setting Up the Server Environment

Make the setup script executable and run it:

```bash
cd /home/ubuntu
chmod +x setup_server.sh
./setup_server.sh
```

This script will:
- Update system packages
- Install Python, PostgreSQL and other dependencies
- Configure PostgreSQL
- Create the database and user
- Set up a Python virtual environment
- Install required Python packages

## 4. Moving Files to the Project Directory

If you uploaded files to your home directory, move them to the project directory:

```bash
# Move all required files to the project directory
mv /home/ubuntu/app.py /home/ubuntu/load_data.py /home/ubuntu/wsgi.py /home/ubuntu/species-api/
mv /home/ubuntu/canada.csv /home/ubuntu/processed_CAN-SAR_vertebrates_1970-2018_async.csv /home/ubuntu/species-api/
```

## 5. Loading Data into the Database

Run the data loading script to populate the database:

```bash
cd /home/ubuntu/species-api
source venv/bin/activate
python load_data.py
```

When prompted, you can choose how many CAN-SAR records to process:
- Enter 'all' to process all records (may take a long time)
- Enter a number (e.g., 1000) to process a limited set for testing

## 6. Setting Up the API Service

Configure the system service to run the API in the background:

```bash
# Move the service file to the systemd directory
sudo mv /home/ubuntu/species-api.service /etc/systemd/system/

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on system boot
sudo systemctl enable species-api

# Start the service
sudo systemctl start species-api

# Check the service status
sudo systemctl status species-api
```

## 7. Testing the API

Test if the API is running correctly:

```bash
# Test the API endpoint
curl http://localhost:5000/api/csi-trends
```

You should see a JSON response with the CSI trend data.

## 8. Firewall Configuration (Optional but Recommended)

Configure the firewall to allow only necessary traffic:

```bash
# Install UFW if not already installed
sudo apt install -y ufw

# Allow SSH (port 22) to ensure you don't get locked out
sudo ufw allow ssh

# Allow API traffic on port 5000
sudo ufw allow 5000/tcp

# Enable the firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 9. Troubleshooting

If you encounter issues:

### Check the service logs
```bash
sudo journalctl -u species-api -f
```

### Check database connection
```bash
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname='cansar_db'"
```

### Restart the service
```bash
sudo systemctl restart species-api
```

### Access the application directly
```bash
cd /home/ubuntu/species-api
source venv/bin/activate
python app.py
```

## 10. API Documentation

The following API endpoints are available:

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `/api/csi-trends` | Returns all CSI trend data | None |
| `/api/cansar/status-over-time` | Species status counts over time | `group` (optional): Filter by taxonomic group |
| `/api/cansar/summary/province` | Summary of species by province | None |
| `/api/cansar/summary/threats` | Summary of threats by IUCN code | None |
| `/api/cansar/summary/actions` | Summary of conservation actions | None |
