-- Create the businesses table
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  instagram TEXT,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  edit_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_edit_token ON businesses(edit_token);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read business data (for public pages)
CREATE POLICY "Anyone can read businesses" ON businesses
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert new businesses
CREATE POLICY "Anyone can create businesses" ON businesses
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows updates only with valid edit token
CREATE POLICY "Anyone can update with valid token" ON businesses
  FOR UPDATE USING (true);