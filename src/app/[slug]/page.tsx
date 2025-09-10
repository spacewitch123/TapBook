'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Business } from '@/types';

interface BusinessPageProps {
  params: { slug: string };
}

export default function BusinessPage({ params }: BusinessPageProps) {
  const searchParams = useSearchParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const success = searchParams.get('success');
  const editToken = searchParams.get('edit');

  const fetchBusiness = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (fetchError) {
        setError('Business not found');
        return;
      }

      setBusiness(data);
    } catch (err) {
      setError('Failed to load business');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
    if (success === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, success]);

  const handleBookService = (serviceName: string) => {
    if (!business) return;
    
    const message = `Hi, I want to book ${serviceName}`;
    const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallNow = () => {
    if (!business) return;
    window.location.href = `tel:${business.whatsapp}`;
  };

  const handleInstagramClick = () => {
    if (!business?.instagram) return;
    const instagramUrl = business.instagram.startsWith('@') 
      ? `https://instagram.com/${business.instagram.slice(1)}`
      : `https://instagram.com/${business.instagram}`;
    window.open(instagramUrl, '_blank');
  };

  const copyEditLink = () => {
    const editUrl = `${window.location.origin}/${params.slug}/edit?token=${editToken}`;
    navigator.clipboard.writeText(editUrl);
    alert('Edit link copied to clipboard!');
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

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
          <p className="text-gray-600">The business you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {showSuccess && editToken && (
        <div className="bg-green-50 border border-green-200 p-4 m-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-800 font-medium">🎉 Your business page is live!</p>
              <p className="text-green-700 text-sm mt-1">Share this link with your customers</p>
            </div>
            <button
              onClick={copyEditLink}
              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Copy Edit Link
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {business.name}
          </h1>
          <div className="w-16 h-1 bg-indigo-600 mx-auto"></div>
        </div>

        {/* Services Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">Our Services</h2>
          {business.services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                <span className="text-xl font-bold text-indigo-600">{service.price}</span>
              </div>
              <button
                onClick={() => handleBookService(service.name)}
                className="w-full bg-whatsapp-green hover:bg-whatsapp-dark text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Book on WhatsApp
              </button>
            </div>
          ))}
        </div>

        {/* Contact Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleCallNow}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </button>

          {business.instagram && (
            <button
              onClick={handleInstagramClick}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987s11.987-5.366 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.281C4.198 14.553 3.646 13.28 3.646 12.017c0-1.263.552-2.536 1.48-3.7.875-.791 2.026-1.281 3.323-1.281s2.448.49 3.323 1.281c.928 1.164 1.48 2.437 1.48 3.7 0 1.263-.552 2.536-1.48 3.7-.875.791-2.026 1.281-3.323 1.281zm7.119 0c-1.297 0-2.448-.49-3.323-1.281-.928-1.164-1.48-2.437-1.48-3.7 0-1.263.552-2.536 1.48-3.7.875-.791 2.026-1.281 3.323-1.281s2.448.49 3.323 1.281c.928 1.164 1.48 2.437 1.48 3.7 0 1.263-.552 2.536-1.48 3.7-.875.791-2.026 1.281-3.323 1.281z"/>
              </svg>
              Follow on Instagram
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Powered by <strong>TapBook</strong></p>
          {editToken && (
            <Link
              href={`/${params.slug}/edit?token=${editToken}`}
              className="mt-2 text-indigo-600 hover:text-indigo-700 underline inline-block"
            >
              Edit this page
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}