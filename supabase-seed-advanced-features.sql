-- Seed script to showcase all advanced styling features
-- Run this AFTER the advanced features migration
-- This creates beautiful sample businesses demonstrating all customization options

-- First, let's clean up any existing test data (optional)
-- DELETE FROM businesses WHERE slug LIKE 'demo-%';

-- 1. NEON CYBERPUNK STUDIO - Showcasing neon theme + particle effects + filters + custom CSS
INSERT INTO businesses (
  slug, name, whatsapp, instagram, services, edit_token, 
  theme, profile, links, layout,
  custom_css, background_pattern, custom_shadow, particle_effect, filters
) VALUES (
  'demo-neon-studio',
  'Neon Digital Studio',
  '+1234567890',
  '@neondigital',
  '[
    {"name": "Web Design", "price": "$299"},
    {"name": "App Development", "price": "$599"},
    {"name": "Branding", "price": "$199"}
  ]'::jsonb,
  'demo-neon-edit-token-' || gen_random_uuid()::text,
  '{
    "style": "neon",
    "primaryColor": "#c084fc",
    "backgroundColor": "#0f0f23",
    "textColor": "#f1f5f9",
    "buttonStyle": "rounded",
    "font": "space-mono",
    "animations": true,
    "hoverEffects": true
  }'::jsonb,
  '{
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "bio": "Creating digital experiences in the cyberpunk era 🚀 Specializing in futuristic UI/UX design"
  }'::jsonb,
  '[
    {
      "id": "1",
      "title": "🌐 Portfolio Website",
      "url": "https://neondigital.com",
      "type": "url",
      "icon": "globe",
      "visible": true
    },
    {
      "id": "2", 
      "title": "📱 Mobile Apps",
      "url": "https://apps.neondigital.com",
      "type": "url",
      "icon": "smartphone",
      "visible": true
    },
    {
      "id": "3",
      "title": "💼 Business Inquiry",
      "url": "mailto:hello@neondigital.com",
      "type": "email",
      "icon": "mail",
      "visible": true
    }
  ]'::jsonb,
  '{
    "showServices": true,
    "servicesStyle": "cards",
    "linkOrder": ["1", "2", "3"]
  }'::jsonb,
  '/* Cyberpunk Neon Effects */
.custom-neon-glow {
  box-shadow: 0 0 20px rgba(192, 132, 252, 0.8), 0 0 40px rgba(192, 132, 252, 0.4), inset 0 0 20px rgba(192, 132, 252, 0.1);
  border: 1px solid rgba(192, 132, 252, 0.6);
  animation: neon-pulse 2s infinite alternate;
}

@keyframes neon-pulse {
  from { box-shadow: 0 0 20px rgba(192, 132, 252, 0.8), 0 0 40px rgba(192, 132, 252, 0.4); }
  to { box-shadow: 0 0 30px rgba(192, 132, 252, 1), 0 0 60px rgba(192, 132, 252, 0.6); }
}

.custom-cyber-grid {
  background-image: 
    linear-gradient(rgba(192, 132, 252, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(192, 132, 252, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}',
  'linear-gradient(45deg, rgba(192, 132, 252, 0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(192, 132, 252, 0.05) 25%, transparent 25%)',
  '0 0 30px rgba(192, 132, 252, 0.8), 0 0 60px rgba(192, 132, 252, 0.4), inset 0 0 20px rgba(192, 132, 252, 0.1)',
  'matrix',
  '{
    "blur": 0,
    "brightness": 110,
    "contrast": 120,
    "saturate": 130,
    "hueRotate": 0,
    "grayscale": 0,
    "sepia": 0,
    "invert": 0,
    "opacity": 100
  }'::jsonb
);

-- 2. GLASSMORPHISM CREATIVE AGENCY - Showcasing glass theme + particles + shadows
INSERT INTO businesses (
  slug, name, whatsapp, instagram, services, edit_token,
  theme, profile, links, layout,
  custom_css, background_pattern, custom_shadow, particle_effect, filters
) VALUES (
  'demo-glass-agency',
  'Aurora Creative Agency',
  '+1987654321',
  '@auroracreative',
  '[
    {"name": "Brand Strategy", "price": "$1,299"},
    {"name": "Visual Identity", "price": "$899"},
    {"name": "Website Design", "price": "$1,599"},
    {"name": "Marketing Campaign", "price": "$2,299"}
  ]'::jsonb,
  'demo-glass-edit-token-' || gen_random_uuid()::text,
  '{
    "style": "glass",
    "primaryColor": "#8b5cf6",
    "backgroundColor": "from-violet-400/20 via-purple-400/20 to-indigo-400/20",
    "textColor": "#1e293b",
    "buttonStyle": "rounded",
    "font": "inter",
    "animations": true,
    "hoverEffects": true
  }'::jsonb,
  '{
    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=150&h=150&fit=crop&crop=face",
    "bio": "Crafting beautiful brand experiences ✨ Where creativity meets strategy"
  }'::jsonb,
  '[
    {
      "id": "1",
      "title": "🎨 View Portfolio",
      "url": "https://aurora.agency/work",
      "type": "url",
      "icon": "palette",
      "visible": true
    },
    {
      "id": "2",
      "title": "📞 Schedule Call",
      "url": "https://calendly.com/aurora",
      "type": "url", 
      "icon": "calendar",
      "visible": true
    },
    {
      "id": "3",
      "title": "💌 Get Quote",
      "url": "mailto:hello@aurora.agency",
      "type": "email",
      "icon": "mail",
      "visible": true
    }
  ]'::jsonb,
  '{
    "showServices": true,
    "servicesStyle": "cards",
    "linkOrder": ["1", "2", "3"]
  }'::jsonb,
  '/* Glassmorphism Effects */
.custom-glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

.custom-floating {
  animation: float-gentle 6s ease-in-out infinite;
}

@keyframes float-gentle {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.custom-aurora-bg {
  background: linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  background-size: 400% 400%;
  animation: aurora-shift 8s ease infinite;
}

@keyframes aurora-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}',
  'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
  '0 8px 32px rgba(31, 38, 135, 0.37), 0 4px 16px rgba(139, 92, 246, 0.2)',
  'bubbles',
  '{
    "blur": 0,
    "brightness": 105,
    "contrast": 110,
    "saturate": 120,
    "hueRotate": 0,
    "grayscale": 0,
    "sepia": 0,
    "invert": 0,
    "opacity": 100
  }'::jsonb
);

-- 3. VINTAGE PHOTOGRAPHY - Showcasing vintage filters + organic patterns + custom shadows
INSERT INTO businesses (
  slug, name, whatsapp, instagram, services, edit_token,
  theme, profile, links, layout,
  custom_css, background_pattern, custom_shadow, particle_effect, filters
) VALUES (
  'demo-vintage-photo',
  'Nostalgic Lens Studio',
  '+1555444333',
  '@nostalgiclens',
  '[
    {"name": "Portrait Session", "price": "$199"},
    {"name": "Wedding Photography", "price": "$1,299"},
    {"name": "Event Coverage", "price": "$599"},
    {"name": "Photo Editing", "price": "$99"}
  ]'::jsonb,
  'demo-vintage-edit-token-' || gen_random_uuid()::text,
  '{
    "style": "gradient",
    "primaryColor": "#d97706",
    "backgroundColor": "from-amber-100 via-orange-200 to-red-200",
    "textColor": "#451a03",
    "buttonStyle": "pill",
    "font": "playfair",
    "animations": true,
    "hoverEffects": true
  }'::jsonb,
  '{
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "bio": "Capturing timeless moments with vintage soul 📷 Film photographer & digital artist"
  }'::jsonb,
  '[
    {
      "id": "1",
      "title": "📸 Photo Gallery",
      "url": "https://nostalgic.photo/gallery",
      "type": "url",
      "icon": "camera",
      "visible": true
    },
    {
      "id": "2",
      "title": "📅 Book Session",
      "url": "https://nostalgic.photo/book",
      "type": "url",
      "icon": "calendar",
      "visible": true
    },
    {
      "id": "3",
      "title": "💝 Print Shop",
      "url": "https://nostalgic.photo/prints",
      "type": "url",
      "icon": "shopping-bag",
      "visible": true
    }
  ]'::jsonb,
  '{
    "showServices": true,
    "servicesStyle": "cards",
    "linkOrder": ["1", "2", "3"]
  }'::jsonb,
  '/* Vintage Film Effects */
.custom-vintage-frame {
  position: relative;
  border: 8px solid #8b4513;
  border-image: linear-gradient(45deg, #8b4513, #d2691e, #8b4513) 1;
  box-shadow: 
    inset 0 0 20px rgba(139, 69, 19, 0.3),
    0 0 20px rgba(139, 69, 19, 0.5);
}

.custom-vintage-frame::before {
  content: "";
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: 
    radial-gradient(circle at 20% 20%, transparent 20%, rgba(139, 69, 19, 0.1) 21%, transparent 22%),
    radial-gradient(circle at 80% 80%, transparent 20%, rgba(139, 69, 19, 0.1) 21%, transparent 22%);
  pointer-events: none;
}

.custom-film-grain {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(139, 69, 19, 0.15) 1px, transparent 0);
  background-size: 3px 3px;
  opacity: 0.3;
}',
  'radial-gradient(ellipse at top left, rgba(217, 119, 6, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(180, 83, 9, 0.1) 0%, transparent 50%)',
  'inset 0 2px 4px rgba(139, 69, 19, 0.2), 0 4px 8px rgba(217, 119, 6, 0.3), 0 8px 16px rgba(217, 119, 6, 0.1)',
  'fireflies',
  '{
    "blur": 0,
    "brightness": 110,
    "contrast": 115,
    "saturate": 120,
    "hueRotate": -10,
    "grayscale": 0,
    "sepia": 30,
    "invert": 0,
    "opacity": 100
  }'::jsonb
);

-- 4. MINIMAL ARCHITECT - Showcasing minimal theme + geometric patterns + subtle effects
INSERT INTO businesses (
  slug, name, whatsapp, instagram, services, edit_token,
  theme, profile, links, layout,
  custom_css, background_pattern, custom_shadow, particle_effect, filters
) VALUES (
  'demo-minimal-arch',
  'Zen Architecture',
  '+1777888999',
  '@zenarchitecture',
  '[
    {"name": "Residential Design", "price": "$2,500"},
    {"name": "Commercial Planning", "price": "$5,000"},
    {"name": "Interior Consulting", "price": "$800"},
    {"name": "3D Visualization", "price": "$1,200"}
  ]'::jsonb,
  'demo-minimal-edit-token-' || gen_random_uuid()::text,
  '{
    "style": "minimal",
    "primaryColor": "#374151",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "buttonStyle": "square",
    "font": "dm-sans",
    "animations": true,
    "hoverEffects": true
  }'::jsonb,
  '{
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    "bio": "Designing spaces that inspire. Minimal. Functional. Beautiful. 🏗️"
  }'::jsonb,
  '[
    {
      "id": "1",
      "title": "🏠 Architecture Portfolio",
      "url": "https://zen.arch/portfolio",
      "type": "url",
      "icon": "home",
      "visible": true
    },
    {
      "id": "2",
      "title": "📐 Design Process",
      "url": "https://zen.arch/process",
      "type": "url",
      "icon": "layers",
      "visible": true
    },
    {
      "id": "3",
      "title": "📧 Project Inquiry",
      "url": "mailto:studio@zen.arch",
      "type": "email",
      "icon": "mail",
      "visible": true
    }
  ]'::jsonb,
  '{
    "showServices": true,
    "servicesStyle": "minimal",
    "linkOrder": ["1", "2", "3"]
  }'::jsonb,
  '/* Minimal Architectural Elements */
.custom-grid-lines {
  background-image: 
    linear-gradient(rgba(55, 65, 81, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(55, 65, 81, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

.custom-minimal-card {
  border: 1px solid rgba(55, 65, 81, 0.1);
  transition: all 0.3s ease;
}

.custom-minimal-card:hover {
  border-color: rgba(55, 65, 81, 0.3);
  transform: translateY(-2px);
}

.custom-blueprint {
  background: 
    linear-gradient(90deg, rgba(55, 65, 81, 0.05) 50%, transparent 50%),
    linear-gradient(rgba(55, 65, 81, 0.05) 50%, transparent 50%);
  background-size: 20px 20px;
}',
  'linear-gradient(rgba(55, 65, 81, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(55, 65, 81, 0.03) 1px, transparent 1px)',
  '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  'geometric',
  '{
    "blur": 0,
    "brightness": 102,
    "contrast": 105,
    "saturate": 95,
    "hueRotate": 0,
    "grayscale": 0,
    "sepia": 0,
    "invert": 0,
    "opacity": 100
  }'::jsonb
);

-- 5. VIBRANT FITNESS TRAINER - Showcasing gradient theme + particles + dynamic effects
INSERT INTO businesses (
  slug, name, whatsapp, instagram, services, edit_token,
  theme, profile, links, layout,
  custom_css, background_pattern, custom_shadow, particle_effect, filters
) VALUES (
  'demo-fitness-energy',
  'Energy Fitness Studio',
  '+1444333222',
  '@energyfitness',
  '[
    {"name": "Personal Training", "price": "$75/session"},
    {"name": "Group Classes", "price": "$25/class"},
    {"name": "Nutrition Plan", "price": "$149"},
    {"name": "Fitness Assessment", "price": "$99"}
  ]'::jsonb,
  'demo-fitness-edit-token-' || gen_random_uuid()::text,
  '{
    "style": "gradient",
    "primaryColor": "#ec4899",
    "backgroundColor": "from-pink-400 via-rose-500 to-red-500",
    "textColor": "#ffffff",
    "buttonStyle": "pill",
    "font": "outfit",
    "animations": true,
    "hoverEffects": true
  }'::jsonb,
  '{
    "avatar": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
    "bio": "💪 Transforming lives through fitness | Certified trainer | Nutrition expert | Your fitness journey starts here!"
  }'::jsonb,
  '[
    {
      "id": "1",
      "title": "💪 Workout Programs",
      "url": "https://energy.fit/programs",
      "type": "url",
      "icon": "zap",
      "visible": true
    },
    {
      "id": "2",
      "title": "📱 Fitness App",
      "url": "https://energy.fit/app",
      "type": "url",
      "icon": "smartphone",
      "visible": true
    },
    {
      "id": "3",
      "title": "📅 Book Session",
      "url": "https://energy.fit/book",
      "type": "url",
      "icon": "calendar",
      "visible": true
    },
    {
      "id": "4",
      "title": "🥗 Meal Plans",
      "url": "https://energy.fit/nutrition",
      "type": "url",
      "icon": "apple",
      "visible": true
    }
  ]'::jsonb,
  '{
    "showServices": true,
    "servicesStyle": "cards",
    "linkOrder": ["1", "2", "3", "4"]
  }'::jsonb,
  '/* High Energy Fitness Effects */
.custom-energy-pulse {
  animation: energy-pulse 2s infinite;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
}

@keyframes energy-pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(236, 72, 153, 0.8), 0 0 40px rgba(236, 72, 153, 0.4);
  }
}

.custom-gradient-border {
  position: relative;
  background: linear-gradient(45deg, #ec4899, #f43f5e, #ef4444);
  padding: 3px;
  border-radius: 20px;
}

.custom-gradient-border::before {
  content: "";
  position: absolute;
  inset: 3px;
  background: white;
  border-radius: 17px;
}

.custom-motion-blur {
  background: linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(244, 63, 94, 0.1));
  animation: motion-wave 3s ease-in-out infinite;
}

@keyframes motion-wave {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}',
  'radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(244, 63, 94, 0.1) 0%, transparent 50%)',
  '0 10px 25px rgba(236, 72, 153, 0.3), 0 5px 10px rgba(244, 63, 94, 0.2)',
  'stars',
  '{
    "blur": 0,
    "brightness": 108,
    "contrast": 115,
    "saturate": 140,
    "hueRotate": 0,
    "grayscale": 0,
    "sepia": 0,
    "invert": 0,
    "opacity": 100
  }'::jsonb
);

-- Display success message
SELECT 
  '🎉 Successfully created 5 demo businesses showcasing advanced features!' as message,
  COUNT(*) as businesses_created,
  array_agg(name) as business_names
FROM businesses 
WHERE slug LIKE 'demo-%';

-- Show what was created
SELECT 
  slug,
  name,
  CASE 
    WHEN particle_effect IS NOT NULL THEN '✨ Particles'
    ELSE ''
  END as particles,
  CASE 
    WHEN custom_css IS NOT NULL THEN '🎨 Custom CSS'
    ELSE ''
  END as css,
  CASE 
    WHEN background_pattern IS NOT NULL THEN '🌈 Patterns'
    ELSE ''
  END as patterns,
  CASE 
    WHEN filters IS NOT NULL THEN '🔮 Filters'
    ELSE ''
  END as filters,
  (theme->>'style') as theme_style
FROM businesses 
WHERE slug LIKE 'demo-%'
ORDER BY slug;