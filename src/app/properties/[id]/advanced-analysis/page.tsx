'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdvancedAnalyzer from '@/components/DealAnalyzer/AdvancedAnalyzer';
import { mockProperties } from '@/lib/mockData';

export default function AdvancedAnalysisPage() {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In production, this would be an API call
    const propertyId = params.id as string;
    const foundProperty = mockProperties.find(p => p.id === propertyId);
    
    if (foundProperty) {
      setProperty(foundProperty);
    }
    setLoading(false);
  }, [params.id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Property Not Found</h1>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/properties" className="text-blue-600 hover:underline">
          Back to Properties
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/properties/${property.id}`} className="text-blue-600 hover:underline text-sm mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Property
          </Link>
          <h1 className="text-3xl font-bold">{property.address}</h1>
          <p className="text-gray-600">{property.city}, {property.state} {property.zip}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">${property.price.toLocaleString()}</div>
          <div className="text-gray-600">${Math.round(property.price / property.sqft)}/sqft</div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-2/3">
          <img 
            src={property.photos_json[0] || "https://placehold.co/800x600/png?text=Property+Photo"} 
            alt={property.address}
            className="w-full h-64 object-cover rounded-lg shadow-md" 
          />
        </div>
        <div className="w-full md:w-1/3 bg-blue-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bedrooms</p>
              <p className="font-medium">{property.beds}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bathrooms</p>
              <p className="font-medium">{property.baths}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Square Feet</p>
              <p className="font-medium">{property.sqft.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year Built</p>
              <p className="font-medium">2005</p> {/* Mock data */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Property Type</p>
              <p className="font-medium">Single Family</p> {/* Mock data */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Lot Size</p>
              <p className="font-medium">0.25 acres</p> {/* Mock data */}
            </div>
          </div>
        </div>
      </div>
      
      <AdvancedAnalyzer 
        propertyId={property.id}
        price={property.price}
        beds={property.beds}
        zip={property.zip}
        sqft={property.sqft}
      />
    </div>
  );
}
