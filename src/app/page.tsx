'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateUniqueSlug, generateEditToken, validateWhatsApp, formatWhatsAppNumber } from '@/lib/utils';
import { Service } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    whatsapp: '',
    instagram: '',
    services: [
      { name: '', price: '' },
      { name: '', price: '' },
      { name: '', price: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleServiceChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData({ ...formData, services: updatedServices });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.businessName.trim()) {
        throw new Error('Business name is required');
      }

      if (!formData.whatsapp.trim()) {
        throw new Error('WhatsApp number is required');
      }

      if (!validateWhatsApp(formData.whatsapp)) {
        throw new Error('Please enter a valid WhatsApp number');
      }

      // Check if at least one service is provided
      const validServices = formData.services.filter(service => 
        service.name.trim() && service.price.trim()
      );

      if (validServices.length === 0) {
        throw new Error('At least one service is required');
      }

      // Generate unique slug and edit token
      const slug = await generateUniqueSlug(formData.businessName);
      const editToken = generateEditToken();

      // Save to database
      const { data, error: dbError } = await supabase
        .from('businesses')
        .insert({
          slug,
          name: formData.businessName.trim(),
          whatsapp: formatWhatsAppNumber(formData.whatsapp),
          instagram: formData.instagram.trim() || null,
          services: validServices,
          edit_token: editToken
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Redirect to public page with success message
      router.push(`/${slug}?success=true&edit=${editToken}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TapBook</h1>
            <p className="text-gray-600">Create your professional page in 30 seconds</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Handle (optional)
                </label>
                <input
                  type="text"
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="@yourbusiness"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Services</h3>
                <p className="text-sm text-gray-600">Add at least one service *</p>
                
                {formData.services.map((service, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Service name"
                    />
                    <input
                      type="text"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="$50"
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Creating...' : 'Create My Page'}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Free forever • No signup required • Mobile optimized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}