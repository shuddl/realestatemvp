import { NextRequest, NextResponse } from 'next/server';
import { mockProperties } from '@/lib/mockData';

// Mock user ID for demo
const MOCK_USER_ID = 'demo-user';

// Mock favorites (just property IDs that are favorited in the mock data)
let favorites = mockProperties
  .filter(property => property.is_favorited)
  .map(property => ({ id: `fav-${property.id}`, user_id: MOCK_USER_ID, property_id: property.id }));

export async function GET(request: NextRequest) {
  // In a real app, we would check authentication here
  try {
    // Get favorite properties for the current user
    const favoriteProperties = mockProperties.filter(property => 
      favorites.some(fav => fav.property_id === property.id && fav.user_id === MOCK_USER_ID)
    );
    
    return NextResponse.json({ 
      favorites: favoriteProperties,
      count: favoriteProperties.length
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { property_id } = await request.json();
    
    // Check if the property exists
    const property = mockProperties.find(p => p.id === property_id);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Check if already favorited
    const existing = favorites.find(
      fav => fav.property_id === property_id && fav.user_id === MOCK_USER_ID
    );
    
    if (existing) {
      return NextResponse.json(
        { error: 'Property already favorited' },
        { status: 400 }
      );
    }
    
    // Add to favorites
    const newFavorite = {
      id: `fav-${property_id}`,
      user_id: MOCK_USER_ID,
      property_id
    };
    
    favorites.push(newFavorite);
    
    return NextResponse.json({ success: true, favorite: newFavorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { property_id } = await request.json();
    
    // Find and remove from favorites
    const initialLength = favorites.length;
    favorites = favorites.filter(
      fav => !(fav.property_id === property_id && fav.user_id === MOCK_USER_ID)
    );
    
    if (favorites.length === initialLength) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}