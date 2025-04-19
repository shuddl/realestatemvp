import axios from 'axios';
import { supabase } from './supabaseClient';

// SimplyRETS API credentials
const simplyRetsApiKey = process.env.SIMPLYRETS_API_KEY;
const simplyRetsApiSecret = process.env.SIMPLYRETS_API_SECRET;

// Base URL for SimplyRETS API
const API_BASE_URL = 'https://api.simplyrets.com';

// Define types
export interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
  cities?: string[];
  counties?: string[];
  zip?: string;
  sort?: string;
}

export interface Property {
  id: string;
  mls_id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  lot_size?: number;
  year_built?: number;
  property_type?: string;
  description?: string;
  photos_json?: string[];
  source_url?: string;
  status: string;
  geo_location?: { lat: number; lng: number };
  last_updated: string;
}

// Function to transform SimplyRETS property to our format
function transformProperty(property: any): Property {
  return {
    id: property.mlsId, // Use MLS ID as the ID for now (will be replaced with UUID in Supabase)
    mls_id: property.mlsId,
    address: property.address.full,
    city: property.address.city,
    state: property.address.state,
    zip: property.address.postalCode,
    price: property.listPrice,
    beds: property.property.bedrooms,
    baths: property.property.bathsFull + (property.property.bathsHalf ? property.property.bathsHalf * 0.5 : 0),
    sqft: property.property.area,
    lot_size: property.property.lotSize,
    year_built: property.property.yearBuilt,
    property_type: property.property.type,
    description: property.remarks,
    photos_json: property.photos ? property.photos.map((photo: any) => photo.url) : [],
    source_url: `/properties/${property.mlsId}`,
    status: property.mls.status,
    geo_location: property.geo ? { lat: property.geo.lat, lng: property.geo.lng } : undefined,
    last_updated: new Date().toISOString(),
  };
}

// Function to fetch properties from SimplyRETS API
export async function fetchListings(filters: PropertyFilter = {}): Promise<Property[]> {
  if (!simplyRetsApiKey || !simplyRetsApiSecret) {
    throw new Error('Missing SimplyRETS API credentials');
  }

  try {
    // Build query parameters
    const params: Record<string, any> = {
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      status: filters.status || 'Active',
    };

    if (filters.minPrice) params.minprice = filters.minPrice;
    if (filters.maxPrice) params.maxprice = filters.maxPrice;
    if (filters.minBeds) params.minbeds = filters.minBeds;
    if (filters.maxBeds) params.maxbeds = filters.maxBeds;
    if (filters.minBaths) params.minbaths = filters.minBaths;
    if (filters.maxBaths) params.maxbaths = filters.maxBaths;
    if (filters.type) params.type = filters.type;
    if (filters.cities && filters.cities.length > 0) params.cities = filters.cities.join(',');
    if (filters.counties && filters.counties.length > 0) params.counties = filters.counties.join(',');
    if (filters.zip) params.postalCodes = filters.zip;
    if (filters.sort) params.sort = filters.sort;

    // Make API request
    const response = await axios.get(`${API_BASE_URL}/properties`, {
      params,
      auth: {
        username: simplyRetsApiKey,
        password: simplyRetsApiSecret,
      },
    });

    // Transform SimplyRETS properties to our format
    const properties = response.data.map(transformProperty);
    
    return properties;
  } catch (error) {
    console.error('Error fetching properties from SimplyRETS:', error);
    throw error;
  }
}

// Function to sync properties from SimplyRETS to Supabase
export async function syncProperties(filters: PropertyFilter = {}): Promise<number> {
  try {
    // Fetch properties from SimplyRETS
    const properties = await fetchListings(filters);
    
    if (properties.length === 0) {
      return 0;
    }

    // Upsert properties to Supabase
    const { error, count } = await supabase
      .from('properties')
      .upsert(properties, {
        onConflict: 'mls_id',
        returning: 'minimal',
        ignoreDuplicates: false,
      })
      .select('count');

    if (error) {
      console.error('Error upserting properties to Supabase:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error syncing properties:', error);
    throw error;
  }
}

// Function to get a single property by ID
export async function getProperty(id: string): Promise<Property | null> {
  try {
    // Try to get property from Supabase first
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('mls_id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" error, which is fine
      console.error('Error fetching property from Supabase:', error);
      throw error;
    }

    if (data) {
      return data as Property;
    }

    // If not found in Supabase, fetch from SimplyRETS
    const response = await axios.get(`${API_BASE_URL}/properties/${id}`, {
      auth: {
        username: simplyRetsApiKey as string,
        password: simplyRetsApiSecret as string,
      },
    });

    const property = transformProperty(response.data);

    // Store in Supabase for future use
    await supabase.from('properties').upsert(property, {
      onConflict: 'mls_id',
      returning: 'minimal',
    });

    return property;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    return null;
  }
}