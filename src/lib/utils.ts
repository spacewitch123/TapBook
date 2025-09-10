import { supabase } from './supabase';

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function generateUniqueSlug(baseName: string): Promise<string> {
  let slug = createSlug(baseName);
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from('businesses')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (!data) {
      return slug;
    }

    slug = `${createSlug(baseName)}-${counter}`;
    counter++;
  }
}

export function generateEditToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function validateWhatsApp(number: string): boolean {
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length >= 10 && cleanNumber.length <= 15;
}

export function formatWhatsAppNumber(number: string): string {
  return number.replace(/\D/g, '');
}