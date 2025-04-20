# Section 8 Real Estate MVP Demo Instructions

This document provides instructions for running the demo version of the Section 8 Real Estate MVP application.

## Running the Demo

To start the demo application:

```bash
npm run demo
```

This will:
1. Configure mock data and environment variables
2. Install required dependencies
3. Build the application (ignoring TypeScript errors)
4. Start the application on port 3500

## Demo Walkthrough

For the video demo, follow these steps:

### 1. Property Listings
- Navigate to the home page to show property listings
- Filter properties using the filter controls
- Note the Section 8 integration with Fair Market Rent data

### 2. Property Details
- Click on a property to view detailed information
- Show the basic deal analysis card with cash flow calculation
- Use the favorite button to demonstrate user interactions

### 3. Advanced Deal Analysis
- Click the "Advanced Analysis" button on a property
- Show the financial analysis parameters that can be adjusted
- Demonstrate how changing parameters affects the deal score
- Switch to the visualizations tab to show charts and projections
- Show the Section 8 compliance tab to highlight program requirements

### 4. Community Features
- Navigate to the community section to show chat functionality
- Demonstrate how investors can share properties

### 5. Coaching Portal
- Show the coaching portal with appointment scheduling
- Highlight the expert review request feature

## Technical Notes

This demo version:
- Uses mock data instead of real API connections
- Bypasses TypeScript error checking for demonstration purposes
- Focuses on UI/UX and core functionality

For any issues during the demo, restart the application using `npm run demo`.
