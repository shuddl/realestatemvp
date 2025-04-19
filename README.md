# Section 8 Real Estate MVP

A platform for analyzing and investing in Section 8 real estate properties.

## Features

- **Property Search & Filtering**: Browse Section 8 properties with advanced filtering options.
- **Deal Analysis**: Calculate potential cash flow based on Fair Market Rent (FMR) and estimated mortgage payments.
- **Favorites**: Save and organize your favorite properties.
- **Community Chat**: Connect with other investors in topic-based channels.
- **Coaching**: Schedule coaching sessions and chat privately with real estate experts.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **Chat**: Stream Chat SDK
- **APIs**: SimplyRETS for property listings, FMR data integration, Calendly for scheduling

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account
- Stream Chat account
- SimplyRETS API access (for property data)
- Calendly account (optional, for scheduling)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key

# Stream Chat
NEXT_PUBLIC_STREAM_API_KEY=your-stream-api-key
STREAM_API_SECRET=your-stream-api-secret

# SimplyRETS API
SIMPLYRETS_API_KEY=your-simplyrets-api-key
SIMPLYRETS_API_SECRET=your-simplyrets-api-secret

# Calendly
NEXT_PUBLIC_CALENDLY_URL=your-calendly-url
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/realestatemvp.git
   cd realestatemvp
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up the Supabase database using the SQL schema in `db/schema.sql`

4. Import FMR data (provide a CSV file with FMR values by zip code)
   ```
   npx ts-node scripts/import-fmr.ts path/to/fmr-data.csv
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

- **properties**: Property listings imported from SimplyRETS
- **fmr_data**: Fair Market Rent data by zip code and bedroom count
- **favorite_properties**: User's saved properties
- **profiles**: Extended user profile information

## Development

- **Run development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production build**: `npm run start`
- **Lint code**: `npm run lint`
- **Type check**: `npm run typecheck`

## Deployment

This project is ready to deploy on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.