'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Business, CustomLink } from '@/types';
import { getBackgroundStyle, getTextStyle, getButtonStyle, getFontClass, THEME_PRESETS } from '@/lib/themes';
import { ExternalLink, Phone, Mail, Instagram, Globe, Eye, Music, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';

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

      // Ensure business has all required fields with defaults
      const businessData: Business = {
        ...data,
        theme: {
          ...(data.theme || THEME_PRESETS.modern),
          // Load advanced features from separate columns
          customCSS: data.custom_css || undefined,
          backgroundPattern: data.background_pattern || undefined,
          customShadow: data.custom_shadow || undefined,
          particleEffect: data.particle_effect || undefined,
          filters: data.filters || undefined
        },
        profile: data.profile || { avatar: null, bio: null },
        links: data.links || [],
        layout: data.layout || { showServices: true, servicesStyle: 'cards', linkOrder: [] }
      };

      setBusiness(businessData);
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

  const handleCustomLink = (link: CustomLink) => {
    let url = link.url;
    
    switch (link.type) {
      case 'email':
        url = `mailto:${link.url}`;
        break;
      case 'phone':
        url = `tel:${link.url}`;
        break;
      case 'url':
      case 'social':
      case 'payment':
        if (!url.startsWith('http')) {
          url = `https://${url}`;
        }
        break;
    }
    
    window.open(url, '_blank');
  };

  const copyEditLink = () => {
    const editUrl = `${window.location.origin}/${params.slug}/edit?token=${editToken}`;
    navigator.clipboard.writeText(editUrl);
    alert('Edit link copied to clipboard!');
  };

  const getLinkIcon = (link: CustomLink) => {
    const iconMap: Record<string, any> = {
      instagram: Instagram,
      facebook: Facebook,
      twitter: Twitter,
      youtube: Youtube,
      linkedin: Linkedin,
      tiktok: Music,
      globe: Globe,
      mail: Mail,
      phone: Phone,
      dollar: ExternalLink
    };

    const IconComponent = iconMap[link.icon] || Globe;
    return <IconComponent className="w-5 h-5" />;
  };

  // Generate CSS filter string from theme filters
  const generateFilterString = () => {
    if (!business?.theme.filters) return '';
    const f = business.theme.filters;
    return `blur(${f.blur}px) brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) hue-rotate(${f.hueRotate}deg) grayscale(${f.grayscale}%) sepia(${f.sepia}%) invert(${f.invert}%) opacity(${f.opacity}%)`;
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

  if (!business) return null;

  const { theme, profile, links, layout } = business;

  return (
    <>
      {/* Custom CSS Injection */}
      {theme.customCSS && <style dangerouslySetInnerHTML={{ __html: theme.customCSS }} />}
      
      <div 
        className={`min-h-screen transition-all duration-500 ${getFontClass(theme.font)} relative overflow-hidden`}
        style={{ 
          backgroundColor: theme.style === 'minimal' || theme.style === 'pastel' ? theme.backgroundColor : 
                           theme.style === 'dark' ? '#0f172a' :
                           theme.style === 'neon' ? '#0f0f23' : undefined,
          background: theme.style === 'gradient' ? `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.primaryColor}40)` :
                     theme.style === 'glass' ? `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))` :
                     undefined,
          fontFamily: theme.font === 'caveat' ? 'Caveat, cursive' : 
                     theme.font === 'playfair' ? 'Playfair Display, serif' :
                     theme.font === 'space-mono' ? 'Space Mono, monospace' : undefined,
          filter: generateFilterString(),
          boxShadow: theme.customShadow || undefined
        }}
      >
        {/* Background Pattern */}
        {theme.backgroundPattern && (
          <div 
            className="absolute inset-0 z-0" 
            style={{
              background: theme.backgroundPattern,
              opacity: 0.3,
              mixBlendMode: 'multiply'
            }}
          />
        )}

        {/* Success Banner */}
        {showSuccess && editToken && (
          <div className="bg-green-50 border border-green-200 p-4 m-4 rounded-lg animate-fadeIn relative z-20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-800 font-medium">🎉 Your business page is live!</p>
                <p className="text-green-700 text-sm mt-1">Share this link with your customers</p>
              </div>
              <button
                onClick={copyEditLink}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
              >
                Copy Edit Link
              </button>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 max-w-md relative z-10">

          {/* Profile Section */}
          <div className="text-center mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {/* Avatar */}
            {profile.avatar && (
              <div className="mb-4">
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-xl hover:scale-105 transition-transform duration-300"
                  style={{
                    borderColor: theme.style === 'dark' || theme.style === 'neon' ? theme.primaryColor : undefined
                  }}
                />
              </div>
            )}

            {/* Business Name */}
            <h1 
              className="text-4xl font-bold mb-4 transition-all duration-300"
              style={{ 
                color: theme.textColor,
                textShadow: theme.style === 'neon' ? `0 0 20px ${theme.primaryColor}` : undefined
              }}
            >
              {business.name}
            </h1>

            {/* Bio */}
            {profile.bio && (
              <p 
                className="text-lg opacity-90 mb-4"
                style={{ color: theme.textColor }}
              >
                {profile.bio}
              </p>
            )}

            {/* Divider */}
            <div 
              className="w-16 h-1 mx-auto mb-8 rounded-full"
              style={{ backgroundColor: theme.primaryColor }}
            />
          </div>

          {/* Custom Links */}
          {links.filter(link => link.visible).length > 0 && (
            <div className="space-y-4 mb-8">
              {links.filter(link => link.visible).map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => handleCustomLink(link)}
                  className={`w-full p-4 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slideUp ${
                    theme.buttonStyle === 'pill' ? 'rounded-full' :
                    theme.buttonStyle === 'square' ? 'rounded-none' :
                    theme.buttonStyle === 'brutal' ? 'rounded-none border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000]' :
                    'rounded-lg'
                  }`}
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: theme.style === 'neon' || theme.style === 'dark' ? theme.textColor : 'white',
                    animationDelay: `${0.1 * index}s`,
                    boxShadow: theme.style === 'neon' ? `0 0 30px ${theme.primaryColor}50` : 
                              theme.buttonStyle === 'brutal' ? '4px 4px 0px 0px #000000' :
                              theme.customShadow || undefined
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getLinkIcon(link)}
                      <span>{link.title}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-60" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Services Section */}
          {layout.showServices && business.services.length > 0 && (
            <div className="space-y-4 mb-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <h2 
                className="text-2xl font-bold text-center mb-6"
                style={{ color: theme.textColor }}
              >
                Our Services
              </h2>
              
              <div className={`space-y-4 ${
                layout.servicesStyle === 'grid' ? 'grid grid-cols-2 gap-4 space-y-0' : ''
              }`}>
                {business.services.map((service, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 hover:scale-105 animate-slideUp ${
                      layout.servicesStyle === 'minimal' 
                        ? 'flex justify-between items-center py-3 border-b border-opacity-20' 
                        : 'bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md'
                    }`}
                    style={{
                      animationDelay: `${0.1 * index}s`,
                      borderColor: theme.textColor,
                      backgroundColor: theme.style === 'glass' ? 'rgba(255,255,255,0.1)' : 
                                     layout.servicesStyle === 'minimal' ? 'transparent' : undefined
                    }}
                  >
                    {service.image && layout.servicesStyle === 'cards' && (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-24 object-cover rounded-md mb-3"
                      />
                    )}
                    
                    <div className={layout.servicesStyle === 'minimal' ? 'flex justify-between items-center w-full' : ''}>
                      <h3 
                        className="font-semibold"
                        style={{ color: theme.textColor }}
                      >
                        {service.name}
                      </h3>
                      <span 
                        className="font-bold text-lg"
                        style={{ color: theme.primaryColor }}
                      >
                        {service.price}
                      </span>
                    </div>
                    
                    {layout.servicesStyle !== 'minimal' && (
                      <button
                        onClick={() => handleBookService(service.name)}
                        className={`w-full mt-3 py-2 px-4 font-medium transition-all duration-300 hover:scale-105 ${
                          theme.buttonStyle === 'pill' ? 'rounded-full' :
                          theme.buttonStyle === 'square' ? 'rounded-none' :
                          theme.buttonStyle === 'brutal' ? 'rounded-none border-2 border-black' :
                          'rounded-lg'
                        }`}
                        style={{
                          backgroundColor: theme.primaryColor,
                          color: theme.style === 'neon' || theme.style === 'dark' ? theme.textColor : 'white'
                        }}
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Buttons */}
          <div className="space-y-4 mb-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => {
                const message = `Hi, I'm interested in your services!`;
                const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className={`w-full py-4 px-6 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                theme.buttonStyle === 'pill' ? 'rounded-full' :
                theme.buttonStyle === 'square' ? 'rounded-none' :
                theme.buttonStyle === 'brutal' ? 'rounded-none border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000]' :
                'rounded-lg'
              }`}
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp Us
            </button>
            
            <button
              onClick={handleCallNow}
              className={`w-full py-4 px-6 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                theme.buttonStyle === 'pill' ? 'rounded-full' :
                theme.buttonStyle === 'square' ? 'rounded-none' :
                theme.buttonStyle === 'brutal' ? 'rounded-none border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000]' :
                'rounded-lg'
              }`}
              style={{
                backgroundColor: theme.textColor,
                color: theme.backgroundColor === '#ffffff' ? '#000000' : '#ffffff'
              }}
            >
              <Phone className="w-5 h-5 mr-3" />
              Call Now
            </button>

            {business.instagram && (
              <button
                onClick={handleInstagramClick}
                className={`w-full py-4 px-6 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${
                  theme.buttonStyle === 'pill' ? 'rounded-full' :
                  theme.buttonStyle === 'square' ? 'rounded-none' :
                  theme.buttonStyle === 'brutal' ? 'rounded-none border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000]' :
                  'rounded-lg'
                }`}
              >
                <Instagram className="w-5 h-5 mr-3" />
                Follow on Instagram
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <p 
              className="opacity-60 mb-2"
              style={{ color: theme.textColor }}
            >
              Powered by <strong>TapBook</strong>
            </p>
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
    </>
  );
}