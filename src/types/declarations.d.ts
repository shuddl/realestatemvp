// Bypass type checking for demo
declare module 'recharts';
declare module 'jspdf';
declare module 'html2canvas';

// Define missing interfaces
interface PropertyWithFavorite {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  photos_json: string[];
  fair_market_rent?: number;
  estimated_mortgage?: number;
  estimated_cash_flow?: number;
  is_favorited: boolean;
}
