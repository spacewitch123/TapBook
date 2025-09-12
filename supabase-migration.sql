-- Migration script to add customization features to existing businesses table
-- Run this in your Supabase SQL editor

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{
  "style": "minimal",
  "primaryColor": "#10b981",
  "backgroundColor": "#ffffff", 
  "textColor": "#000000",
  "buttonStyle": "rounded",
  "font": "inter"
}'::jsonb;

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS profile JSONB DEFAULT '{
  "avatar": null,
  "bio": null
}'::jsonb;

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '[]'::jsonb;

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS layout JSONB DEFAULT '{
  "showServices": true,
  "servicesStyle": "cards",
  "linkOrder": []
}'::jsonb;

-- Update existing records to have the default values
UPDATE businesses SET 
  theme = '{
    "style": "minimal",
    "primaryColor": "#10b981",
    "backgroundColor": "#ffffff",
    "textColor": "#000000", 
    "buttonStyle": "rounded",
    "font": "inter"
  }'::jsonb,
  profile = '{
    "avatar": null,
    "bio": null
  }'::jsonb,
  links = '[]'::jsonb,
  layout = '{
    "showServices": true,
    "servicesStyle": "cards",
    "linkOrder": []
  }'::jsonb
WHERE theme IS NULL;