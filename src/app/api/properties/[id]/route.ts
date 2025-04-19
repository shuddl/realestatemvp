import { NextRequest, NextResponse } from 'next/server';
import { mockProperties } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const property = mockProperties.find(p => p.id === id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property details' },
      { status: 500 }
    );
  }
}