export interface Service {
  name: string;
  price: string;
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
}