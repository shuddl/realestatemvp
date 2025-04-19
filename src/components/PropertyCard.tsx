'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { formatCurrency } from '@/lib/utils';

interface PropertyCardProps {
  property: any;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(property.is_favorited || false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine cash flow status for styling
  const cashFlowStatus = property.estimated_cash_flow > 0 
    ? 'positive' 
    : property.estimated_cash_flow < 0 
      ? 'negative' 
      : 'neutral';

  const cashFlowColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  }[cashFlowStatus];

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirectUrl=/properties/${property.id}`;
      return;
    }

    setIsLoading(true);
    
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
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Property Image */}
      <div className="relative h-48 w-full">
        {property.photos_json && property.photos_json.length > 0 ? (
          <Image
            src={property.photos_json[0]}
            alt={property.address}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
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
      
      {/* Property Details */}
      <div className="p-4">
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-lg font-semibold mb-1 text-gray-900 hover:text-primary">
            {property.address}
          </h3>
        </Link>
        <p className="text-gray-600 mb-2">{property.city}, {property.state} {property.zip}</p>
        <p className="text-xl font-bold text-primary mb-3">{formatCurrency(property.price)}</p>
        
        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{property.beds} bd</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{property.baths} ba</span>
          </div>
          {property.sqft && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
              <span>{property.sqft} sqft</span>
            </div>
          )}
        </div>
        
        {/* FMR and Cash Flow Analysis */}
        <div className="bg-gray-50 -mx-4 px-4 py-3 mt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Fair Market Rent</p>
              <p className="font-medium">
                {property.fair_market_rent 
                  ? formatCurrency(property.fair_market_rent) + '/mo' 
                  : 'No data available'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Est. Mortgage</p>
              <p className="font-medium">
                {formatCurrency(property.estimated_mortgage)}/mo
              </p>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-gray-500">Est. Cash Flow</p>
            <p className={`font-bold ${cashFlowColor}`}>
              {property.estimated_cash_flow !== null 
                ? formatCurrency(property.estimated_cash_flow) + '/mo' 
                : 'No data available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}