'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { debounce } from 'lodash';

interface PropertyFiltersProps {
  filters: {
    minPrice: string;
    maxPrice: string;
    minBeds: string;
    maxBeds: string;
    minBaths: string;
    maxBaths: string;
    city: string;
    zip: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function PropertyFilters({ filters, onFilterChange }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced filter update to reduce API calls
  const debouncedUpdateFilters = useCallback(
    debounce((newFilters) => {
      onFilterChange(newFilters);
      
      // Update URL with filters
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });
      
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      
      router.push(newUrl);
    }, 500),
    [pathname, router, onFilterChange]
  );

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    debouncedUpdateFilters(newFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    const emptyFilters = {
      minPrice: '',
      maxPrice: '',
      minBeds: '',
      maxBeds: '',
      minBaths: '',
      maxBaths: '',
      city: '',
      zip: '',
    };
    
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
    router.push(pathname);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={localFilters.minPrice}
                onChange={handleFilterChange}
                className="input w-full"
              />
            </div>
            <div className="w-1/2">
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={localFilters.maxPrice}
                onChange={handleFilterChange}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Beds */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <select
                name="minBeds"
                value={localFilters.minBeds}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="">Min</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div className="w-1/2">
              <select
                name="maxBeds"
                value={localFilters.maxBeds}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="">Max</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Baths */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <select
                name="minBaths"
                value={localFilters.minBaths}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="">Min</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div className="w-1/2">
              <select
                name="maxBaths"
                value={localFilters.maxBaths}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="">Max</option>
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="2">2</option>
                <option value="2.5">2.5</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={localFilters.city}
                onChange={handleFilterChange}
                className="input w-full"
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="zip"
                placeholder="Zip"
                value={localFilters.zip}
                onChange={handleFilterChange}
                className="input w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reset Filters Button */}
      <div className="mt-4 text-right">
        <button 
          onClick={resetFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}