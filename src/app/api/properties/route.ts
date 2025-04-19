import { NextRequest, NextResponse } from 'next/server';
import { PropertyFilter } from '@/lib/idxService';
import { mockProperties, mockFmrData } from '@/lib/mockData';

// Function to get FMR data for a property
function getFMRData(zip: string, beds: number) {
  const fmrData = mockFmrData.find(data => data.zip_code === zip);
  
  if (!fmrData) {
    return null;
  }

  let fmrValue: number | null = null;

  // Map beds to the corresponding FMR value
  switch (beds) {
    case 0:
      fmrValue = fmrData.beds_0;
      break;
    case 1:
      fmrValue = fmrData.beds_1;
      break;
    case 2:
      fmrValue = fmrData.beds_2;
      break;
    case 3:
      fmrValue = fmrData.beds_3;
      break;
    case 4:
    default:
      fmrValue = fmrData.beds_4;
      break;
  }

  return fmrValue;
}

// Simple mortgage calculation function
function calculateMortgage(price: number) {
  // Assume 7% interest rate, 30 year term, 20% down payment
  const downPaymentPercent = 0.2;
  const interestRate = 0.07;
  const loanTermYears = 30;

  const loanAmount = price * (1 - downPaymentPercent);
  const monthlyInterestRate = interestRate / 12;
  const loanTermMonths = loanTermYears * 12;

  // Calculate P&I payment
  const mortgagePayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  // Add estimated taxes and insurance (2% of property value annually, divided by 12)
  const taxesAndInsurance = (price * 0.02) / 12;

  // Total PITI payment
  return Math.round(mortgagePayment + taxesAndInsurance);
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters: PropertyFilter = {};

    // Extract filter parameters
    if (searchParams.has('minPrice')) filters.minPrice = parseInt(searchParams.get('minPrice') || '0');
    if (searchParams.has('maxPrice')) filters.maxPrice = parseInt(searchParams.get('maxPrice') || '0');
    if (searchParams.has('minBeds')) filters.minBeds = parseInt(searchParams.get('minBeds') || '0');
    if (searchParams.has('maxBeds')) filters.maxBeds = parseInt(searchParams.get('maxBeds') || '0');
    if (searchParams.has('minBaths')) filters.minBaths = parseInt(searchParams.get('minBaths') || '0');
    if (searchParams.has('maxBaths')) filters.maxBaths = parseInt(searchParams.get('maxBaths') || '0');
    if (searchParams.has('status')) filters.status = searchParams.get('status') || 'Active';
    if (searchParams.has('type')) filters.type = searchParams.get('type') || '';
    if (searchParams.has('limit')) filters.limit = parseInt(searchParams.get('limit') || '20');
    if (searchParams.has('offset')) filters.offset = parseInt(searchParams.get('offset') || '0');
    if (searchParams.has('city')) filters.cities = [searchParams.get('city') || ''];
    if (searchParams.has('zip')) filters.zip = searchParams.get('zip') || '';
    if (searchParams.has('sort')) filters.sort = searchParams.get('sort') || '';

    // Apply filters to mock data
    let filteredProperties = [...mockProperties];
    
    if (filters.minPrice) filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice) filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
    if (filters.minBeds) filteredProperties = filteredProperties.filter(p => p.beds >= filters.minBeds!);
    if (filters.maxBeds) filteredProperties = filteredProperties.filter(p => p.beds <= filters.maxBeds!);
    if (filters.minBaths) filteredProperties = filteredProperties.filter(p => p.baths >= filters.minBaths!);
    if (filters.maxBaths) filteredProperties = filteredProperties.filter(p => p.baths <= filters.maxBaths!);
    if (filters.status) filteredProperties = filteredProperties.filter(p => p.status.toLowerCase() === filters.status!.toLowerCase());
    if (filters.type) filteredProperties = filteredProperties.filter(p => p.property_type?.toLowerCase() === filters.type!.toLowerCase());
    if (filters.cities && filters.cities.length > 0) {
      filteredProperties = filteredProperties.filter(p => filters.cities!.includes(p.city));
    }
    if (filters.zip) filteredProperties = filteredProperties.filter(p => p.zip === filters.zip);

    // Apply pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const paginatedProperties = filteredProperties.slice(offset, offset + limit);

    // For demo purposes, we'll use the pre-calculated values in the mock data
    // In a real app, these would be freshly calculated based on FMR data

    return NextResponse.json({
      properties: paginatedProperties,
      total: filteredProperties.length,
      hasMore: offset + limit < filteredProperties.length,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}