#!/bin/bash

# Exit on error
set -e

echo "🚀 Section 8 Real Estate MVP Deployment Script"
echo "==============================================="

# Create .env.local file with mock data for demo purposes
echo "🔑 Creating environment variables..."
cat > .env.local << EOL
# Supabase (Using Mock Data)
NEXT_PUBLIC_SUPABASE_URL=https://mock-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=mock-anon-key-for-demo-purposes-only
SUPABASE_SERVICE_ROLE_KEY=mock-service-key-for-demo-purposes-only

# Stream Chat (Using Demo API Key)
NEXT_PUBLIC_STREAM_API_KEY=dz5f4d5kzrue
STREAM_API_SECRET=mock-stream-secret-for-demo-purposes-only

# SimplyRETS API (Mock)
SIMPLYRETS_API_KEY=simplyrets
SIMPLYRETS_API_SECRET=simplyrets

# Calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/demo
EOL

# Ensure required directories exist
mkdir -p src/scripts
mkdir -p mock-data

# Create mock data for FMR data
echo "📊 Setting up mock data..."
cat > mock-data/fmr-sample.csv << EOL
zip_code,county,state,beds_0,beds_1,beds_2,beds_3,beds_4,year
90210,Los Angeles,CA,1200,1500,2000,2500,3000,2023
10001,New York,NY,1500,1800,2300,2800,3300,2023
78701,Travis,TX,900,1200,1600,2000,2400,2023
75001,Dallas,TX,850,1100,1400,1800,2200,2023
33101,Miami-Dade,FL,1100,1400,1800,2200,2600,2023
60601,Cook,IL,950,1300,1700,2100,2500,2023
98101,King,WA,1300,1600,2100,2600,3100,2023
20001,Washington,DC,1400,1700,2200,2700,3200,2023
02108,Suffolk,MA,1250,1550,2050,2550,3050,2023
30301,Fulton,GA,950,1200,1600,2000,2400,2023
EOL

# Create a script to add mock property data
cat > src/scripts/seed-mock-data.js << EOL
// This script would normally interact with Supabase
// For the demo, we're just logging the process
console.log('Seeding mock property data...');
console.log('Adding 10 properties to the database...');
console.log('Adding FMR data for 10 zip codes...');
console.log('Mock data seeding completed!');
EOL

echo "🏠 Setting up mock property data..."
node src/scripts/seed-mock-data.js

echo "📦 Installing dependencies..."
if command -v npm >/dev/null 2>&1; then
  npm install --no-audit
  
  echo "🏗️ Building the application..."
  npm run build
  
  echo "🌟 Starting the application for demo..."
  echo "📱 The app will be available at http://localhost:3500"
  echo "⚠️ Since this is a demo with mock data, login functionality will appear to work but won't"
  echo "   persist real user data. Browse the UI as if logged in to see all features."
  echo ""
  echo "🎥 Ready for your demo video recording!"
  echo "==============================================="
  
  PORT=3500 npm run start
else
  echo "❌ npm is required but not installed."
  echo "Please install Node.js and npm before running this script."
  echo "You can download it from: https://nodejs.org/"
  exit 1
fi