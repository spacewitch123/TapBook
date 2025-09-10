# TapBook - Link in Bio for Local Service Businesses

A minimal, mobile-first platform for local service businesses to create professional pages in under 30 seconds.

## Features

- 🚀 **Quick Setup**: Create a professional business page in 30 seconds
- 📱 **Mobile-First**: Optimized for mobile devices with large touch targets
- 💚 **WhatsApp Integration**: Direct booking through WhatsApp with pre-filled messages
- 📞 **One-Click Calling**: Easy phone number dialing
- 📸 **Instagram Integration**: Link to Instagram profiles
- ✏️ **Easy Editing**: Update business info anytime with secure edit links
- 🔒 **No Auth Required**: No signups, passwords, or complex workflows
- ⚡ **Fast Loading**: Built with Next.js 14 for optimal performance

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom WhatsApp green theme

## Quick Start

### Prerequisites

- Node.js 18+ 
- A Supabase account
- A Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone <your-repo>
cd tapbook
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project
2. Run the SQL from `supabase-schema.sql` in your Supabase SQL editor
3. Copy your project URL and anon key

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running.

### 5. Deploy to Vercel

```bash
npm run build
vercel deploy
```

Add your environment variables in the Vercel dashboard.

## Project Structure

```
src/
├── app/
│   ├── [slug]/           # Dynamic business pages
│   │   ├── page.tsx      # Public business page
│   │   └── edit/
│   │       └── page.tsx  # Edit page with token auth
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── not-found.tsx     # 404 page
│   └── page.tsx          # Landing page
├── components/           # Reusable components (future)
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Utility functions
└── types/
    └── index.ts         # TypeScript types
```

## Database Schema

```sql
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
```

## How It Works

1. **Business Creation**: User fills out form with business name, WhatsApp, services, and optional Instagram
2. **URL Generation**: System creates URL-safe slug from business name (with uniqueness check)
3. **Security**: Random edit token generated for future updates
4. **Public Page**: Mobile-optimized page with service cards, booking buttons, and contact info
5. **Easy Updates**: Edit link allows updating business info anytime

## Features by Page

### Landing Page (`/`)
- Simple signup form
- Real-time validation
- Automatic slug generation
- Success redirect with edit link

### Business Page (`/[slug]`)
- Hero section with business name
- Service cards with prices
- WhatsApp booking with pre-filled messages
- One-click phone calling
- Instagram profile link
- Success messages for new businesses

### Edit Page (`/[slug]/edit?token=[token]`)
- Token-based authentication
- Pre-filled form with current data
- Update validation
- Copy public page link
- Success feedback

## Mobile Optimization

- Touch-friendly 44px minimum button heights
- Optimized tap targets
- Fast loading with Next.js optimization
- Safe area padding for modern phones
- Professional gradients and shadows
- WhatsApp green (#25D366) for booking buttons

## Security Features

- Edit tokens for page updates (no passwords needed)
- Input sanitization and validation
- SQL injection protection via Supabase
- XSS protection via React
- Rate limiting through Vercel

## Customization

### Colors
Update `tailwind.config.ts` to modify the color scheme:

```ts
colors: {
  whatsapp: {
    green: '#25D366',  // WhatsApp brand green
    dark: '#128C7E',   // Darker shade for hover
  },
}
```

### Styling
All styles use Tailwind CSS. Key classes:
- `bg-gradient-to-br from-blue-50 to-indigo-100` - Landing page gradient
- `bg-whatsapp-green` - WhatsApp booking buttons
- `shadow-lg` - Card shadows for professional look

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please use the GitHub issues page.