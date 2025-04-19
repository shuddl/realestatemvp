'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minBeds: '',
    maxBeds: '',
    minBaths: '',
    maxBaths: '',
    city: '',
    zip: '',
  });

  useEffect(() => {
    // Initialize filters from URL search params
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const minBeds = searchParams.get('minBeds') || '';
    const maxBeds = searchParams.get('maxBeds') || '';
    const minBaths = searchParams.get('minBaths') || '';
    const maxBaths = searchParams.get('maxBaths') || '';
    const city = searchParams.get('city') || '';
    const zip = searchParams.get('zip') || '';

    setFilters({
      minPrice,
      maxPrice,
      minBeds,
      maxBeds,
      minBaths,
      maxBaths,
      city,
      zip,
    });
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.minBeds) queryParams.append('minBeds', filters.minBeds);
      if (filters.maxBeds) queryParams.append('maxBeds', filters.maxBeds);
      if (filters.minBaths) queryParams.append('minBaths', filters.minBaths);
      if (filters.maxBaths) queryParams.append('maxBaths', filters.maxBaths);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.zip) queryParams.append('zip', filters.zip);
      
      // Add pagination
      const limit = 12;
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', ((page - 1) * limit).toString());

      const response = await fetch(`/api/properties?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      
      if (page === 1) {
        setProperties(data.properties);
      } else {
        setProperties(prev => [...prev, ...data.properties]);
      }
      
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to fetch properties. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Section 8 Properties</h1>
      
      <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading && page === 1 ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center my-12">
          <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8 mb-12">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="btn btn-primary px-6"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}