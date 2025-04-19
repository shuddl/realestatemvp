'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabaseClient';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch favorite property IDs
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('favorite_properties')
        .select('property_id')
        .eq('user_id', user.id);

      if (favoriteError) throw favoriteError;

      if (favoriteData.length === 0) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      // Extract property IDs
      const propertyIds = favoriteData.map(item => item.property_id);

      // Fetch property details
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds);

      if (propertiesError) throw propertiesError;

      // Enhance properties with FMR data and mortgage estimates
      const enhancedProperties = await Promise.all(
        properties.map(async (property) => {
          // Get FMR data
          const { data: fmrData } = await supabase
            .from('fmr_data')
            .select('*')
            .eq('zip_code', property.zip)
            .order('year', { ascending: false })
            .limit(1);

          let fairMarketRent = null;
          if (fmrData && fmrData.length > 0) {
            // Map beds to the corresponding FMR value
            switch (property.beds) {
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
          const price = property.price;
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

          return {
            ...property,
            is_favorited: true,
            fair_market_rent: fairMarketRent,
            estimated_mortgage: estimatedMortgage,
            estimated_cash_flow: cashFlow,
          };
        })
      );

      setFavorites(enhancedProperties);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to fetch your favorite properties. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please sign in to view your favorites.{' '}
                <a href="/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Properties</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">
            You haven't saved any properties to your favorites list yet. Browse properties and add them to your favorites.
          </p>
          <a href="/properties" className="btn btn-primary inline-block">
            Browse Properties
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}