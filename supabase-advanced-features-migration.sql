-- Migration script to add advanced customization features
-- Run this in your Supabase SQL editor to support the new design studio features

-- Add new columns for advanced customization
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS custom_css TEXT DEFAULT NULL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS background_pattern TEXT DEFAULT NULL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS custom_shadow TEXT DEFAULT NULL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS particle_effect TEXT DEFAULT NULL;

-- Add filters as JSONB column
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS filters JSONB DEFAULT NULL;

-- Update theme column to support new properties by making it more flexible
-- The existing theme column will continue to work, but we'll add the new properties via app logic

-- Optional: Add indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_businesses_particle_effect ON businesses(particle_effect);
CREATE INDEX IF NOT EXISTS idx_businesses_background_pattern ON businesses(background_pattern);

-- Grant necessary permissions (if using RLS)
-- The existing policies should cover these new columns automatically

-- Optional: Set some example advanced features for testing
-- Uncomment the lines below if you want to test with sample data
/*
UPDATE businesses 
SET 
  custom_css = '/* Custom styles */\n.custom-glow { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }',
  particle_effect = 'stars',
  filters = '{
    "blur": 0,
    "brightness": 100,
    "contrast": 100,
    "saturate": 100,
    "hueRotate": 0,
    "grayscale": 0,
    "sepia": 0,
    "invert": 0,
    "opacity": 100
  }'::jsonb
WHERE id IN (SELECT id FROM businesses LIMIT 1); -- Only update first business for testing
*/

-- Show current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
ORDER BY ordinal_position;