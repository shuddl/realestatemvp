# Section 8 Real Estate MVP Demo Instructions

## Running the Demo

1. Run the deployment script to set up the demo environment:
   ```
   ./deploy-demo.sh
   ```

2. The application will be available at http://localhost:3000

## Demo Flow for Client Presentation

When recording a video or presenting to the client, follow this flow to highlight key features:

### 1. Homepage & Overview (30 seconds)
- Show the homepage and explain the platform's purpose
- Point out the clean, professional design

### 2. Property Listings (1 minute)
- Navigate to the Properties page
- Demonstrate filtering properties (price, bedrooms, location)
- Show how properties display Fair Market Rent and cash flow calculations
- Highlight positive cash flow properties with green indicators

### 3. Property Detail (1 minute)
- Select any property to view details
- Showcase the image gallery
- Point out the property specifications
- Focus on the Deal Analysis section on the right:
  - Show how FMR data is displayed
  - Demonstrate the interactive mortgage calculator
  - Show how changes to down payment, interest rate, etc. affect cash flow

### 4. Favorites (30 seconds)
- Add a property to favorites (heart icon)
- Navigate to the Favorites page
- Show the saved property and how it can be accessed later

### 5. Community Chat (30 seconds)
- Navigate to the Community chat section
- Show the channel list and messaging interface
- Explain how investors can connect with each other

### 6. Coaching (30 seconds)
- Navigate to the Coaching section
- Showcase coach profiles
- Show the Calendly integration for scheduling
- Briefly mention the private coaching chat

### 7. User Account (15 seconds)
- Show the sign up/login flow
- Mention security features

## Important Demo Notes

1. For the demo, we're using mock data - point out this is just for demonstration
2. The login functionality appears to work but doesn't persist real user data
3. During recording, point out that the final version will connect to:
   - Real Section 8/FMR data
   - SimplyRETS or other IDX feed
   - Actual Supabase backend
   - Production Stream Chat channels

## Key Features to Emphasize

- **Deal Analysis**: The automatic calculation of potential cash flow based on Section 8 FMR data
- **User Experience**: Clean, intuitive interface designed for investors
- **Community & Coaching**: Going beyond just listings to build a platform for Section 8 investors

If you have limited time, focus on the Property and Deal Analysis features, as these are the core value proposition.