'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { validateWhatsApp, formatWhatsAppNumber } from '@/lib/utils';
import { THEME_PRESETS } from '@/lib/themes';
import { Business, Theme, Profile, CustomLink, Layout } from '@/types';
import ThemePicker from '@/components/editor/ThemePicker';
import ColorPicker from '@/components/editor/ColorPicker';
import ProfileEditor from '@/components/editor/ProfileEditor';
import LinkManager from '@/components/editor/LinkManager';
import ServiceEditor from '@/components/editor/ServiceEditor';
import LivePreview from '@/components/editor/LivePreview';
import { Save, Eye, Settings, Link as LinkIcon, Palette, User, Briefcase, Share2, ArrowLeft } from 'lucide-react';

interface EditPageProps {
  params: { slug: string };
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'appearance' | 'links' | 'services' | 'settings'>('links');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(async (updatedBusiness: Business) => {
    if (!token || !updatedBusiness) return;
    
    setAutoSaving(true);
    try {
      await supabase
        .from('businesses')
        .update({
          name: updatedBusiness.name,
          whatsapp: updatedBusiness.whatsapp,
          instagram: updatedBusiness.instagram,
          services: updatedBusiness.services,
          theme: updatedBusiness.theme,
          profile: updatedBusiness.profile,
          links: updatedBusiness.links,
          layout: updatedBusiness.layout
        })
        .eq('slug', params.slug)
        .eq('edit_token', token);
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [params.slug, token]);

  // Debounced auto-save
  useEffect(() => {
    if (!business || loading) return;
    
    const timeoutId = setTimeout(() => {
      autoSave(business);
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [business, autoSave, loading]);

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

      // Ensure business has all required fields with defaults
      const businessData: Business = {
        ...data,
        theme: data.theme || THEME_PRESETS.modern,
        profile: data.profile || { avatar: null, bio: null, coverImage: null },
        links: data.links || [],
        layout: data.layout || { showServices: true, servicesStyle: 'cards', linkOrder: [] }
      };

      setBusiness(businessData);
    } catch (err) {
      setError('Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  // Update handlers
  const updateTheme = (theme: Theme) => {
    if (!business) return;
    setBusiness({ ...business, theme });
  };

  const updateProfile = (profile: Profile) => {
    if (!business) return;
    setBusiness({ ...business, profile });
  };

  const updateBusinessName = (name: string) => {
    if (!business) return;
    setBusiness({ ...business, name });
  };

  const updateLinks = (links: CustomLink[]) => {
    if (!business) return;
    setBusiness({ ...business, links });
  };

  const updateLayout = (layout: Layout) => {
    if (!business) return;
    setBusiness({ ...business, layout });
  };

  const updateServices = (services: any[]) => {
    if (!business) return;
    setBusiness({ ...business, services });
  };

  const updateWhatsApp = (whatsapp: string) => {
    if (!business) return;
    setBusiness({ ...business, whatsapp });
  };

  const updateInstagram = (instagram: string) => {
    if (!business) return;
    setBusiness({ ...business, instagram: instagram || null });
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/${params.slug}`;
    navigator.clipboard.writeText(publicUrl);
    setSuccess('Link copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const tabs = [
    { id: 'links', label: 'Links', icon: LinkIcon, description: 'Add and organize your links' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize your page design' },
    { id: 'services', label: 'Services', icon: Briefcase, description: 'Manage your services' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Profile and contact info' }
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your page...</p>
        </div>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
          >
            Create New Page
          </button>
        </div>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Linktree-style Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/${params.slug}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to page</span>
              </button>
              
              <div className="h-6 w-px bg-gray-200"></div>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{business.name}</h1>
                <p className="text-xs text-gray-500">tapbook.com/{business.slug}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Auto-save status */}
              <div className="flex items-center gap-2">
                {autoSaving ? (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-3 h-3 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : lastSaved ? (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Saved
                  </div>
                ) : null}
              </div>

              {/* Share button */}
              <button
                onClick={copyPublicLink}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              {/* Preview button */}
              <button
                onClick={() => window.open(`/${business.slug}`, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-green-800 font-medium text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs opacity-75">{tab.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Center Panel - Editor */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200">
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'links' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Links</h2>
                      <p className="text-gray-600 text-sm">Add buttons that link to all of your content in one place.</p>
                    </div>
                    <LinkManager 
                      links={business.links}
                      onLinksChange={updateLinks}
                    />
                  </div>
                )}
                
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Appearance</h2>
                      <p className="text-gray-600 text-sm">Customize the look and feel of your page.</p>
                    </div>
                    
                    <ThemePicker 
                      currentTheme={business.theme}
                      onThemeChange={updateTheme}
                    />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Custom Colors</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <ColorPicker
                          label="Primary Color"
                          color={business.theme.primaryColor}
                          onChange={(color) => updateTheme({ ...business.theme, primaryColor: color })}
                        />
                        <ColorPicker
                          label="Background Color"
                          color={business.theme.backgroundColor}
                          onChange={(color) => updateTheme({ ...business.theme, backgroundColor: color })}
                        />
                        <ColorPicker
                          label="Text Color"
                          color={business.theme.textColor}
                          onChange={(color) => updateTheme({ ...business.theme, textColor: color })}
                        />
                      </div>
                    </div>
                    
                    {/* Font and Button Style */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Typography & Buttons</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
                          <select
                            value={business.theme.font}
                            onChange={(e) => updateTheme({ 
                              ...business.theme, 
                              font: e.target.value as Theme['font']
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="inter">Inter</option>
                            <option value="outfit">Outfit</option>
                            <option value="space-mono">Space Mono</option>
                            <option value="playfair">Playfair Display</option>
                            <option value="caveat">Caveat</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
                          <select
                            value={business.theme.buttonStyle}
                            onChange={(e) => updateTheme({ 
                              ...business.theme, 
                              buttonStyle: e.target.value as Theme['buttonStyle']
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="rounded">Rounded</option>
                            <option value="pill">Pill</option>
                            <option value="square">Square</option>
                            <option value="brutal">Brutal</option>
                            <option value="ghost">Ghost</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Services</h2>
                      <p className="text-gray-600 text-sm">Showcase your services with prices and booking options.</p>
                    </div>
                    <ServiceEditor
                      services={business.services}
                      layout={business.layout}
                      onServicesChange={updateServices}
                      onLayoutChange={updateLayout}
                    />
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile & Settings</h2>
                      <p className="text-gray-600 text-sm">Update your profile information and contact details.</p>
                    </div>
                    
                    <ProfileEditor
                      businessName={business.name}
                      profile={business.profile}
                      onNameChange={updateBusinessName}
                      onProfileChange={updateProfile}
                    />
                    
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                            WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            id="whatsapp"
                            value={business.whatsapp}
                            onChange={(e) => updateWhatsApp(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="+1234567890"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                            Instagram Handle (optional)
                          </label>
                          <input
                            type="text"
                            id="instagram"
                            value={business.instagram || ''}
                            onChange={(e) => updateInstagram(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="@yourbusiness"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-1">
            <LivePreview business={business} />
          </div>
          
        </div>
      </div>
    </div>
  );
}