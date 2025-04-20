'use client';

import React from 'react';
import Link from 'next/link';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';

type PropertyActionsProps = {
  propertyId: string;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
};

export default function PropertyActions({ propertyId, isFavorited, onFavoriteToggle }: PropertyActionsProps) {
  const supabaseClient = useSupabaseClient();
  const [loading, setLoading] = React.useState(false);

  const handleFavoriteToggle = async () => {
    try {
      setLoading(true);
      // In a production app, this would interact with Supabase
      // For demo purposes, we'll just toggle the state
      onFavoriteToggle();
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Error updating favorites');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={handleFavoriteToggle}
        disabled={loading}
        className={`flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm shadow-sm ${
          isFavorited
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke={isFavorited ? "currentColor" : "none"}
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 015.656 0 4 4 0 010 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
            fill={isFavorited ? "currentColor" : "none"}
          />
        </svg>
        {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
      
      <Link
        href={`/properties/${propertyId}/advanced-analysis`}
        className="flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm shadow-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z"
            clipRule="evenodd"
          />
        </svg>
        Advanced Analysis
      </Link>
      
      <Link
        href={`/community/share/${propertyId}`}
        className="flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm shadow-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        Share in Community
      </Link>
      
      <Link
        href={`/coaching/property-review/${propertyId}`}
        className="flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm shadow-sm bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        Request Expert Review
      </Link>
    </div>
  );
}
