# Database Migrations

## Running Migrations

### Option 1: Automated (Recommended)
```bash
npm run migrate
```

This command will:
- Load your Supabase credentials from `.env.local`
- Attempt to run the migration automatically
- If automatic execution fails, display the SQL for manual execution

### Option 2: Manual
1. Go to your Supabase dashboard: [SQL Editor](https://supabase.com/dashboard/project/YOUR_PROJECT/sql)
2. Copy the contents of `supabase-migration.sql`
3. Paste and run in the SQL Editor

## Current Migration

The `supabase-migration.sql` file adds the following columns to the `businesses` table:

- `theme` (JSONB) - Stores theme configuration (colors, fonts, styles)
- `profile` (JSONB) - Stores profile data (avatar, bio, cover image)
- `links` (JSONB) - Stores custom links array
- `layout` (JSONB) - Stores layout preferences

## Schema Changes

After running the migration, your business records will have these new fields with sensible defaults:

```json
{
  "theme": {
    "style": "minimal",
    "primaryColor": "#10b981",
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "buttonStyle": "rounded",
    "font": "inter"
  },
  "profile": {
    "avatar": null,
    "bio": null,
    "coverImage": null
  },
  "links": [],
  "layout": {
    "showServices": true,
    "servicesStyle": "cards",
    "linkOrder": []
  }
}
```

## Troubleshooting

### Permission Errors
If you get permission errors, you may need to:
1. Use the service role key instead of anon key in your environment
2. Or run the migration manually through the Supabase dashboard

### Adding Service Role Key (Optional)
Add to your `.env.local`:
```
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

⚠️ **Never commit service role keys to version control!**