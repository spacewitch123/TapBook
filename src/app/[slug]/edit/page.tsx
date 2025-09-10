'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { validateWhatsApp, formatWhatsAppNumber } from '@/lib/utils';
import { Business } from '@/types';

interface EditPageProps {
  params: { slug: string };
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [business, setBusiness] = useState<Business | null>(null);
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Edit token is required');
      setLoading(false);
      return;
    }
    fetchBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, token]);

  const fetchBusiness = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', params.slug)
        .eq('edit_token', token)
        .single();

      if (fetchError) {
        setError('Invalid edit token or business not found');
        return;
      }

      setBusiness(data);
      
      // Populate form with existing data
      setFormData({
        businessName: data.name,
        whatsapp: data.whatsapp,
        instagram: data.instagram || '',
        services: [
          ...(data.services || []),
          ...Array(Math.max(0, 3 - (data.services?.length || 0))).fill({ name: '', price: '' })
        ].slice(0, 3)
      });
    } catch (err) {
      setError('Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData({ ...formData, services: updatedServices });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

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

      // Update database
      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          name: formData.businessName.trim(),
          whatsapp: formatWhatsAppNumber(formData.whatsapp),
          instagram: formData.instagram.trim() || null,
          services: validServices
        })
        .eq('slug', params.slug)
        .eq('edit_token', token);

      if (updateError) throw updateError;

      setSuccess('Business updated successfully!');
      setTimeout(() => {
        router.push(`/${params.slug}`);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/${params.slug}`;
    navigator.clipboard.writeText(publicUrl);
    alert('Public page link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Business</h1>
            <p className="text-gray-600">Update your business information</p>
            <button
              onClick={copyPublicLink}
              className="mt-2 text-indigo-600 hover:text-indigo-700 underline text-sm"
            >
              📋 Copy public page link
            </button>
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
                <p className="text-sm text-gray-600">At least one service is required *</p>
                
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

              {success && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                  {success}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? 'Saving...' : 'Update Business'}
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/${params.slug}`)}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                >
                  View Public Page
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Keep this edit link safe • Share your public page with customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}