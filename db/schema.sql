-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mls_id TEXT UNIQUE,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  beds SMALLINT NOT NULL,
  baths DECIMAL(3, 1) NOT NULL,
  sqft INTEGER,
  lot_size DECIMAL(12, 2),
  year_built SMALLINT,
  property_type TEXT,
  description TEXT,
  photos_json JSONB,
  source_url TEXT,
  status TEXT DEFAULT 'active',
  geo_location POINT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create properties policies
CREATE POLICY "Properties are viewable by everyone" ON public.properties
  FOR SELECT USING (true);

-- Create fmr_data table for Fair Market Rent data
CREATE TABLE IF NOT EXISTS public.fmr_data (
  id SERIAL PRIMARY KEY,
  zip_code TEXT NOT NULL,
  county TEXT,
  state TEXT NOT NULL,
  beds_0 DECIMAL(10, 2), -- Studio
  beds_1 DECIMAL(10, 2), -- 1 Bedroom
  beds_2 DECIMAL(10, 2), -- 2 Bedrooms
  beds_3 DECIMAL(10, 2), -- 3 Bedrooms
  beds_4 DECIMAL(10, 2), -- 4 Bedrooms
  year SMALLINT NOT NULL,
  UNIQUE (zip_code, year)
);

-- Enable RLS
ALTER TABLE public.fmr_data ENABLE ROW LEVEL SECURITY;

-- Create fmr_data policies
CREATE POLICY "FMR data is viewable by everyone" ON public.fmr_data
  FOR SELECT USING (true);

-- Create favorite_properties table
CREATE TABLE IF NOT EXISTS public.favorite_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.favorite_properties ENABLE ROW LEVEL SECURITY;

-- Create favorite_properties policies
CREATE POLICY "Users can view their own favorites" ON public.favorite_properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.favorite_properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorite_properties
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS properties_zip_idx ON public.properties (zip);
CREATE INDEX IF NOT EXISTS properties_beds_idx ON public.properties (beds);
CREATE INDEX IF NOT EXISTS properties_price_idx ON public.properties (price);
CREATE INDEX IF NOT EXISTS properties_status_idx ON public.properties (status);
CREATE INDEX IF NOT EXISTS fmr_data_zip_idx ON public.fmr_data (zip_code);
CREATE INDEX IF NOT EXISTS fmr_data_year_idx ON public.fmr_data (year);

-- Create a view to calculate potential cash flow
CREATE OR REPLACE VIEW public.property_cash_flow AS
SELECT 
  p.id,
  p.address,
  p.city,
  p.state,
  p.zip,
  p.price,
  p.beds,
  p.baths,
  CASE
    WHEN p.beds = 0 THEN fmr.beds_0
    WHEN p.beds = 1 THEN fmr.beds_1
    WHEN p.beds = 2 THEN fmr.beds_2
    WHEN p.beds = 3 THEN fmr.beds_3
    WHEN p.beds >= 4 THEN fmr.beds_4
    ELSE NULL
  END AS fair_market_rent,
  -- Simple mortgage estimation (monthly payment)
  -- Assuming 7% interest rate, 30-year term, 20% down payment
  ROUND(
    (p.price * 0.8 * (0.07/12) * POWER(1 + (0.07/12), 360)) / 
    (POWER(1 + (0.07/12), 360) - 1)
  ) AS estimated_mortgage,
  -- Estimated cash flow
  CASE
    WHEN p.beds = 0 THEN fmr.beds_0
    WHEN p.beds = 1 THEN fmr.beds_1
    WHEN p.beds = 2 THEN fmr.beds_2
    WHEN p.beds = 3 THEN fmr.beds_3
    WHEN p.beds >= 4 THEN fmr.beds_4
    ELSE NULL
  END - 
  ROUND(
    (p.price * 0.8 * (0.07/12) * POWER(1 + (0.07/12), 360)) / 
    (POWER(1 + (0.07/12), 360) - 1)
  ) AS estimated_cash_flow
FROM
  public.properties p
LEFT JOIN 
  public.fmr_data fmr ON p.zip = fmr.zip_code AND fmr.year = EXTRACT(YEAR FROM CURRENT_DATE);

-- Enable RLS on the view
ALTER VIEW public.property_cash_flow SET (security_invoker = true);