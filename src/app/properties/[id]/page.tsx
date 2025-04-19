'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { getProperty } from '@/lib/idxService';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritingLoading, setFavoritingLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Mortgage calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(7.0);
  const [loanTerm, setLoanTerm] = useState(30);
  const [calculatedMortgage, setCalculatedMortgage] = useState<number | null>(null);
  const [calculatedCashFlow, setCalculatedCashFlow] = useState<number | null>(null);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const propertyData = await getProperty(id as string);
        
        if (!propertyData) {
          setError('Property not found');
          setIsLoading(false);
          return;
        }

        // Get FMR data
        const { data: fmrData } = await supabase
          .from('fmr_data')
          .select('*')
          .eq('zip_code', propertyData.zip)
          .order('year', { ascending: false })
          .limit(1);

        let fairMarketRent = null;
        if (fmrData && fmrData.length > 0) {
          // Map beds to the corresponding FMR value
          switch (propertyData.beds) {
            case 0:
              fairMarketRent = fmrData[0].beds_0;
              break;
            case 1:
              fairMarketRent = fmrData[0].beds_1;
              break;
            case 2:
              fairMarketRent = fmrData[0].beds_2;
              break;
            case 3:
              fairMarketRent = fmrData[0].beds_3;
              break;
            case 4:
            default:
              fairMarketRent = fmrData[0].beds_4;
              break;
          }
        }

        // Calculate mortgage
        const price = propertyData.price;
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
        const estimatedMortgage = Math.round(mortgagePayment + taxesAndInsurance);
        const cashFlow = fairMarketRent !== null ? fairMarketRent - estimatedMortgage : null;

        const enhancedProperty = {
          ...propertyData,
          fair_market_rent: fairMarketRent,
          estimated_mortgage: estimatedMortgage,
          estimated_cash_flow: cashFlow,
        };

        setProperty(enhancedProperty);
        setCalculatedMortgage(estimatedMortgage);
        setCalculatedCashFlow(cashFlow);

        // Check if property is favorited
        if (user) {
          const { data: favoriteData } = await supabase
            .from('favorite_properties')
            .select('id')
            .eq('user_id', user.id)
            .eq('property_id', propertyData.id)
            .limit(1);

          setIsFavorited(!!favoriteData && favoriteData.length > 0);
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to fetch property details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetail();
    }
  }, [id, user]);

  useEffect(() => {
    // Recalculate mortgage and cash flow when inputs change
    if (property) {
      const price = property.price;
      const downPaymentDecimal = downPaymentPercent / 100;
      const interestRateDecimal = interestRate / 100;
      const loanTermMonths = loanTerm * 12;

      const loanAmount = price * (1 - downPaymentDecimal);
      const monthlyInterestRate = interestRateDecimal / 12;

      // Calculate P&I payment
      const mortgagePayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

      // Add estimated taxes and insurance (2% of property value annually, divided by 12)
      const taxesAndInsurance = (price * 0.02) / 12;

      // Total PITI payment
      const calculatedMortgage = Math.round(mortgagePayment + taxesAndInsurance);
      setCalculatedMortgage(calculatedMortgage);

      // Calculate cash flow
      const cashFlow = property.fair_market_rent !== null
        ? property.fair_market_rent - calculatedMortgage
        : null;
      setCalculatedCashFlow(cashFlow);
    }
  }, [property, downPaymentPercent, interestRate, loanTerm]);

  const toggleFavorite = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirectUrl=/properties/${id}`;
      return;
    }

    if (!property) return;

    setFavoritingLoading(true);
    
    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', property.id);

        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_properties')
          .insert({ user_id: user.id, property_id: property.id });

        if (error) throw error;
      }

      // Update local state
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    } finally {
      setFavoritingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error || 'Property not found'}
        </div>
        <div className="text-center">
          <a href="/properties" className="btn btn-primary inline-block">
            Back to Properties
          </a>
        </div>
      </div>
    );
  }

  // Determine cash flow status for styling
  const cashFlowStatus = calculatedCashFlow && calculatedCashFlow > 0 
    ? 'positive' 
    : calculatedCashFlow && calculatedCashFlow < 0 
      ? 'negative' 
      : 'neutral';

  const cashFlowColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  }[cashFlowStatus];

  const cashFlowBg = {
    positive: 'bg-green-50',
    negative: 'bg-red-50',
    neutral: 'bg-gray-50',
  }[cashFlowStatus];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <a href="/properties" className="text-primary hover:text-primary/80 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to properties
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Images and details */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="mb-8">
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-4">
              {property.photos_json && property.photos_json.length > 0 ? (
                <Image
                  src={property.photos_json[activeImageIndex]}
                  alt={`${property.address} - Image ${activeImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              
              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                disabled={favoritingLoading}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none z-10"
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={isFavorited ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  className={`w-6 h-6 ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Thumbnail gallery */}
            {property.photos_json && property.photos_json.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {property.photos_json.map((photo: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 relative h-20 w-20 rounded-md overflow-hidden ${
                      activeImageIndex === idx ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`${property.address} - Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property details */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{property.address}</h1>
            <p className="text-xl text-gray-700 mb-4">{property.city}, {property.state} {property.zip}</p>
            <div className="flex items-center justify-between mb-6">
              <p className="text-3xl font-bold text-primary">{formatCurrency(property.price)}</p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Beds</p>
                  <p className="font-semibold">{property.beds}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Baths</p>
                  <p className="font-semibold">{property.baths}</p>
                </div>
                {property.sqft && (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Sq Ft</p>
                    <p className="font-semibold">{formatNumber(property.sqft)}</p>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Year</p>
                    <p className="font-semibold">{property.year_built}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>
            </div>
          )}

          {/* Property features */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Property Type</p>
                <p className="font-medium">{property.property_type || 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium capitalize">{property.status || 'Active'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">MLS ID</p>
                <p className="font-medium">{property.mls_id || 'Not available'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Last Updated</p>
                <p className="font-medium">{formatDate(property.last_updated || new Date())}</p>
              </div>
              {property.lot_size && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Lot Size</p>
                  <p className="font-medium">{formatNumber(property.lot_size)} sq ft</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Financial analysis */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Financial Analysis</h2>
              
              {/* FMR Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Section 8 Fair Market Rent</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm mb-1">Estimated FMR for {property.beds} bedroom in {property.zip}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {property.fair_market_rent 
                      ? formatCurrency(property.fair_market_rent) + '/mo' 
                      : 'No data available'}
                  </p>
                </div>
              </div>
              
              {/* Mortgage Calculator */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Mortgage Calculator</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (%)</label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5%</span>
                      <span>{downPaymentPercent}%</span>
                      <span>50%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>3%</span>
                      <span>{interestRate.toFixed(1)}%</span>
                      <span>12%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className="input w-full"
                    >
                      <option value="15">15 years</option>
                      <option value="20">20 years</option>
                      <option value="30">30 years</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Purchase Price</p>
                    <p className="font-bold text-lg">{formatCurrency(property.price)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Down Payment ({downPaymentPercent}%)</p>
                    <p className="font-medium">
                      {formatCurrency(property.price * (downPaymentPercent / 100))}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Estimated Monthly Payment (PITI)</p>
                    <p className="font-medium">
                      {calculatedMortgage ? formatCurrency(calculatedMortgage) + '/mo' : 'Calculating...'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Includes principal, interest, taxes and insurance
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${cashFlowBg}`}>
                    <p className="text-gray-500 text-sm">Estimated Monthly Cash Flow</p>
                    <p className={`text-xl font-bold ${cashFlowColor}`}>
                      {calculatedCashFlow !== null
                        ? formatCurrency(calculatedCashFlow) + '/mo'
                        : 'No FMR data available'}
                    </p>
                  </div>
                  
                  {calculatedCashFlow !== null && calculatedCashFlow > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-green-800">
                        This property may have positive cash flow based on Section 8 Fair Market Rent!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}