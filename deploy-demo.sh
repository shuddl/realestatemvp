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

# Skip TypeScript checking for import scripts
NEXT_SKIP_IMPORT_TYPESCRIPT_CHECK=true
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

# Create a mock lib/mockData.ts file if it doesn't exist
if [ ! -f src/lib/mockData.ts ]; then
  echo "📊 Creating mock data file..."
  mkdir -p src/lib
  cat > src/lib/mockData.ts << EOL
export const mockProperties = [
  {
    id: '1',
    address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210',
    price: 750000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    description: 'Beautiful property in a prime location.',
    photos_json: [
      'https://placehold.co/600x400/png?text=Property+1'
    ],
    fair_market_rent: 2500,
    estimated_mortgage: 2200,
    estimated_cash_flow: 300,
    is_favorited: false
  },
  {
    id: '2',
    address: '456 Oak Ave',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    price: 1200000,
    beds: 2,
    baths: 2,
    sqft: 1200,
    description: 'Modern apartment in the heart of the city.',
    photos_json: [
      'https://placehold.co/600x400/png?text=Property+2'
    ],
    fair_market_rent: 2800,
    estimated_mortgage: 3200,
    estimated_cash_flow: -400,
    is_favorited: true
  },
  {
    id: '3',
    address: '789 Pine Ln',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    price: 550000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    description: 'Spacious family home with large backyard.',
    photos_json: [
      'https://placehold.co/600x400/png?text=Property+3'
    ],
    fair_market_rent: 2000,
    estimated_mortgage: 1800,
    estimated_cash_flow: 200,
    is_favorited: false
  },
  {
    id: '4',
    address: '101 Cedar Rd',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
    price: 650000,
    beds: 3,
    baths: 2.5,
    sqft: 1950,
    description: 'Beautiful home close to the beach.',
    photos_json: [
      'https://placehold.co/600x400/png?text=Property+4'
    ],
    fair_market_rent: 2200,
    estimated_mortgage: 2100,
    estimated_cash_flow: 100,
    is_favorited: false
  },
  {
    id: '5',
    address: '222 Maple Dr',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    price: 580000,
    beds: 2,
    baths: 2,
    sqft: 1350,
    description: 'Cozy condo in downtown with great views.',
    photos_json: [
      'https://placehold.co/600x400/png?text=Property+5'
    ],
    fair_market_rent: 2100,
    estimated_mortgage: 1950,
    estimated_cash_flow: 150,
    is_favorited: true
  }
];

export const mockFMRData = {
  "90210": { beds_1: 1500, beds_2: 2000, beds_3: 2500, beds_4: 3000 },
  "10001": { beds_1: 1800, beds_2: 2300, beds_3: 2800, beds_4: 3300 },
  "78701": { beds_1: 1200, beds_2: 1600, beds_3: 2000, beds_4: 2400 },
  "33101": { beds_1: 1400, beds_2: 1800, beds_3: 2200, beds_4: 2600 },
  "60601": { beds_1: 1300, beds_2: 1700, beds_3: 2100, beds_4: 2500 }
};

export const calculateMortgage = (price: number, downPaymentPercent = 20, interestRate = 7, loanTermYears = 30) => {
  const downPayment = price * (downPaymentPercent / 100);
  const loanAmount = price - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  // Calculate monthly principal and interest payment
  const x = Math.pow(1 + monthlyInterestRate, numberOfPayments);
  const monthlyPayment = loanAmount * (monthlyInterestRate * x) / (x - 1);
  
  // Estimate property tax (1% of property value annually)
  const monthlyPropertyTax = price * 0.01 / 12;
  
  // Estimate insurance ($1000 annually)
  const monthlyInsurance = 1000 / 12;
  
  // Return total monthly PITI payment
  return Math.round(monthlyPayment + monthlyPropertyTax + monthlyInsurance);
};
EOL
fi

echo "📦 Installing dependencies..."
if command -v npm >/dev/null 2>&1; then
  npm install --no-audit
  
  echo "🏗️ Building the application..."
  NEXT_SKIP_TYPESCRIPT_CHECK=true npm run build
  
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