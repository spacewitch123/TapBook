export interface Service {
  name: string;
  price: string;
  image?: string;
}

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  type: 'url' | 'email' | 'phone' | 'payment' | 'social';
  icon: string;
  visible: boolean;
}

export interface Theme {
  style: 'minimal' | 'dark' | 'gradient' | 'glass' | 'neon' | 'pastel';
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonStyle: 'rounded' | 'pill' | 'square' | 'brutal' | 'ghost';
  font: 'inter' | 'outfit' | 'space-mono' | 'playfair' | 'caveat';
}

export interface Profile {
  avatar?: string | null;
  bio?: string | null;
  coverImage?: string | null;
}

export interface Layout {
  showServices: boolean;
  servicesStyle: 'cards' | 'list' | 'grid' | 'minimal';
  linkOrder: string[];
}

export interface Business {
  id?: string;
  slug: string;
  name: string;
  whatsapp: string;
  instagram?: string | null;
  services: Service[];
  edit_token: string;
  created_at?: string;
  
  // New customization fields
  theme: Theme;
  profile: Profile;
  links: CustomLink[];
  layout: Layout;
}